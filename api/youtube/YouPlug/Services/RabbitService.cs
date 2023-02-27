using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using YouPlug.Db;
using YouPlug.Dto.Youtube;
using YouPlug.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static YouPlug.Dto.Rabbit.RabbitDto;

namespace YouPlug.Services
{
    public class RabbitService
    {
        private ConnectionFactory factory;
        private IConnection connection;
        private IModel channel;
        private string? queueInit;
        private string? queryDisable;
        private string? eventQueue;

        public RabbitService(Uri hostUri)
        {
            queueInit = Environment.GetEnvironmentVariable("EVENT_INITIALIZATION_QUEUE", EnvironmentVariableTarget.Process);
            queryDisable = Environment.GetEnvironmentVariable("EVENT_DISABLED_QUEUE", EnvironmentVariableTarget.Process);
            eventQueue = Environment.GetEnvironmentVariable("EVENT_QUEUE", EnvironmentVariableTarget.Process);

            if (string.IsNullOrWhiteSpace(queueInit))
                throw new Exception("Unable to recover EVENT_INITIALIZATION_QUEUE env var!");
            if (string.IsNullOrWhiteSpace(queryDisable))
                throw new Exception("Unable to recover EVENT_DISABLED_QUEUE env var!");
            if (string.IsNullOrWhiteSpace(eventQueue))
                throw new Exception("Unable to recover EVENT_QUEUE env var!");

            Console.WriteLine("RabbitMQ: Connecting to " + hostUri);
            factory = new ConnectionFactory() { Uri = hostUri };
            connection = factory.CreateConnection();
            channel = connection.CreateModel();

            Console.WriteLine("Init: " + queueInit);
            Console.WriteLine("Disable: " + queryDisable);
            channel.QueueDeclare(queue: queueInit,
                     durable: true,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);
            channel.QueueBind(queueInit, "amq.direct", queueInit);
            channel.QueueDeclare(queue: queryDisable,
                     durable: true,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);
            channel.QueueBind(queryDisable, "amq.direct", queryDisable);
            Console.WriteLine("RabbitMQ: Ready!");
        }

        private T? ReadMessage<T>(BasicDeliverEventArgs ea)
        {
            var body = ea.Body.ToArray();
            var message = JsonSerializer.Deserialize<T>(body);

            if (message == null)
            {
                Console.WriteLine("Error (RabbitService) : " + "Unable to deserialize message");
                return default(T);
            }

            return message;
        }

        private void OnInitConsume(object? sender, BasicDeliverEventArgs ea)
        {
            Console.WriteLine("Received init event");
            bool handled = false;
            EventInitializeDto? message = null;

            try
            {
                if (Program.fetcherService == null)
                    throw new Exception("FetcherService not ready!!!");
                
                message = ReadMessage<EventInitializeDto>(ea);
                if (message == null)
                    throw new Exception("Unable to deserialize message");

                Console.WriteLine("Initializing event {0} for user {1}...", message.eventId, message.userId);

                switch (message.eventId)
                {
                    case "newVideoFromChannel":
                        Console.WriteLine("New video from channel {0} for user {1} for plugId {2} with fields: {3}!", message.eventId, message.userId, message.plugId, message.fields[0].key + " = " + message.fields[0].value);
                        NewVideoFromChannelModel model = new()
                        {
                            channelId = message.fields.Where(x => x.key == "channelId").First().value,
                            userId = message.userId,
                            plugId = message.plugId,
                            lastVideoDate = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds()
                        };
                        Program.fetcherService.AddNewVideoFromChannel(model);
                        handled = true;
                        break;
                    default:
                        Console.WriteLine("Error (RabbitService) : " + "Unable to handle message");
                        handled = false; // Just to be over sure
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error (RabbitService) : " + ex.Message + " | " + ex.Source + " | " + ex.StackTrace);
            }

            if (!handled)
            {
                Console.WriteLine("Error (RabbitService) : " + "Unable to handle message");
                channel.BasicNack(ea.DeliveryTag, false, false);
                return;
            }
            channel.BasicAck(ea.DeliveryTag, false);
            Console.WriteLine("Initialized event {0} for user {1}!", message.eventId, message.userId);
        }

        private void OnDisableConsume(object? sender, BasicDeliverEventArgs ea)
        {
            Console.WriteLine("Received disable event");
            bool handled = false;
            PlugDisabledDto? message = null;

            try
            {

                if (Program.fetcherService == null)
                    throw new Exception("FetcherService not ready!!!");

                message = ReadMessage<PlugDisabledDto>(ea);
                if (message == null)
                    throw new Exception("Unable to deserialize message");

                Console.WriteLine("Disabling event {0} for user {1}...", message.eventId, message.userId);

                switch (message.eventId)
                {
                    case "newVideoFromChannel":
                        Program.fetcherService.RemoveNewVideoFromChannel(message.userId, message.plugId);
                        handled = true;
                        break;
                    default:
                        Console.WriteLine("Error (RabbitService) : " + "Unable to handle message");
                        handled = false; // Just to be over sure
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error (RabbitService) : " + ex.Message + " | " + ex.Source + " | " + ex.StackTrace);
                handled = false; // Just to be over sure
            }

            if (!handled)
            {
                Console.WriteLine("Error (RabbitService) : " + "Unable to handle message");
                channel.BasicNack(ea.DeliveryTag, false, false);
                return;
            }
            channel.BasicAck(ea.DeliveryTag, false);
            Console.WriteLine("Disabled event {0} for user {1}!", message.eventId, message.userId);
        }

        public void OnNewVideoFromChannel(NewVideoFromChannelModel model, VideoDto videoDto)
        {
            if (channel == null)
            {
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                return;
            }

            FireEvent("newVideoFromChannel", model.plugId, model.userId, new Variable[] {
                new Variable() { key = "channelTitle", value = videoDto.ChannelTitle },
                new Variable() { key = "videoTitle", value = videoDto.Title },
            });
        }


        public void FireEvent(string eventId, string plugId, int userId, Variable[] variables)
        {
            if (channel == null) {
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                return;
            }

            EventFiredDto eventFiredDto = new()
            {
                serviceName = "youtube",
                eventId = eventId,
                plugId = plugId,
                userId = userId,
                variables = variables
            };

            var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(eventFiredDto));
            channel.BasicPublish("amq.direct", eventQueue, null, body);
            Console.WriteLine("Fired event {0} for user {1}!", eventId, userId);
        }

        public void Start()
        {
            if (channel == null) {
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                return;
            }

            var initConsumer = new EventingBasicConsumer(channel);
            initConsumer.Received += OnInitConsume;

            var disableConsumer = new EventingBasicConsumer(channel);
            disableConsumer.Received += OnDisableConsume;
                
            channel.BasicConsume(queueInit, false, initConsumer);
            channel.BasicConsume(queryDisable, false, disableConsumer);
            Console.WriteLine("RabbitMQ: Started!");
        }
    }
}
