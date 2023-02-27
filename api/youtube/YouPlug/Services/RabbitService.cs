using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using YouPlug.Db;
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
            Console.WriteLine("RabbitMQ: Connecting to " + hostUri);
            factory = new ConnectionFactory() { Uri = hostUri };
            connection = factory.CreateConnection();
            channel = connection.CreateModel();

            Console.WriteLine("Init: " + queueInit);
            Console.WriteLine("Init: " + queueInit);
            Console.WriteLine("Disable: " + queryDisable);
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
            Console.WriteLine("RabbitMQ: Ready!");
        }

        private T? ReadMessage<T>(BasicDeliverEventArgs ea)
        {
            var body = ea.Body.ToArray();
            var message = JsonSerializer.Deserialize<T>(body);

            if (message == null)
            {
                Console.WriteLine("Error (RabbitService) : " + "Unable to deserialize message");
                Console.WriteLine("Error (RabbitService) : " + "Unable to deserialize message");
                return default(T);
            }

            return message;
        }

        private void OnInitConsume(object? sender, BasicDeliverEventArgs ea)
        {
            bool handled = false;
            EventInitializeDto? message = null;

            try
            {
                message = ReadMessage<EventInitializeDto>(ea);
                if (message == null)
                    throw new Exception("Unable to deserialize message");

                Console.WriteLine("Initializing event {0} for user {1}...", message.eventId, message.userId);
                Console.WriteLine("Initializing event {0} for user {1}...", message.eventId, message.userId);

                switch (message.eventId)
                {
                    case "newVideoFromChannel":
                        // TODO
                        handled = true;
                        break;
                    default:
                        Console.WriteLine("Error (RabbitService) : " + "Unable to handle message");
                        Console.WriteLine("Error (RabbitService) : " + "Unable to handle message");
                        handled = false; // Just to be over sure
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error (RabbitService) : " + ex.Message);
                Console.WriteLine("Error (RabbitService) : " + ex.Message);
            }

            if (!handled)
            {
                Console.WriteLine("Error (RabbitService) : " + "Unable to handle message");
                Console.WriteLine("Error (RabbitService) : " + "Unable to handle message");
                channel.BasicNack(ea.DeliveryTag, false, true);
            }
            channel.BasicAck(ea.DeliveryTag, false);
            Console.WriteLine("Initialized event {0} for user {1}", message.eventId, message.userId);
            Console.WriteLine("Initialized event {0} for user {1}", message.eventId, message.userId);
        }

        private void OnDisableConsume(object? sender, BasicDeliverEventArgs ea)
        {
            bool handled = false;
            PlugDisabledDto? message = null;

            try
            {
                message = ReadMessage<PlugDisabledDto>(ea);
                if (message == null)
                    throw new Exception("Unable to deserialize message");

                Console.WriteLine("Disabling event {0} for user {1}...", message.eventId, message.userId);
                Console.WriteLine("Disabling event {0} for user {1}...", message.eventId, message.userId);

                switch (message.eventId)
                {
                    case "newVideoFromSubChannel":
                        // TODO
                        handled = true;
                        break;
                    default:
                        Console.WriteLine("Error (RabbitService) : " + "Unable to handle message");
                        Console.WriteLine("Error (RabbitService) : " + "Unable to handle message");
                        handled = false; // Just to be over sure
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error (RabbitService) : " + ex.Message);
                Console.WriteLine("Error (RabbitService) : " + ex.Message);
                handled = false; // Just to be over sure
            }

            if (!handled)
            {
                Console.WriteLine("Error (RabbitService) : " + "Unable to handle message");
                Console.WriteLine("Error (RabbitService) : " + "Unable to handle message");
                channel.BasicNack(ea.DeliveryTag, false, true);
            }
            channel.BasicAck(ea.DeliveryTag, false);
            Console.WriteLine("Disabled event {0} for user {1}", message.eventId, message.userId);
        }

        public async void OnNewVideoFromChannel(EventInitializeDto triggerDto)
        {
            if (channel == null)
            {
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                return;
            }

            Console.WriteLine("Setting up repository update for user {0}...", triggerDto.userId);
            Console.WriteLine("Setting up repository update for user {0}...", triggerDto.userId);
            
            string? channelId = triggerDto.fields.Where(f => f.key == "channelId").FirstOrDefault()?.value;

            if (string.IsNullOrWhiteSpace(channelId))
            {
                Console.WriteLine("Error (RabbitService) : " + "Unable to find channelId in triggerDto");
                Console.WriteLine("Error (RabbitService) : " + "Unable to find channelId in triggerDto");
                return;
            }

            NewVideoFromChannelModel newVideoFromChannelModel = new()
            {
                userId = triggerDto.userId.ToString(),
                channelId = channelId,
                plugId = triggerDto.plugId,
            };

            // Add new listener


            // TODO: var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(newSubscribedChannelDto));
            // channel.BasicPublish("amq.direct", "newSubscribedChannel", null, body);
        }


        public void FireEvent(string eventId, string plugId, int userId, Variable[] variables)
        {
            if (channel == null) {
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                return;
            }

            EventFiredDto eventFiredDto = new()
            {
                serviceName = "YouTube",
                eventId = eventId,
                plugId = plugId,
                userId = userId,
                variables = variables
            };

            var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(eventFiredDto));
            channel.BasicPublish("amq.direct", eventQueue, null, body);
        }

        public void Start()
        {
            if (channel == null) {
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                return;
            }

            var initConsumer = new EventingBasicConsumer(channel);
            initConsumer.Received += OnInitConsume;

            var disableConsumer = new EventingBasicConsumer(channel);
            disableConsumer.Received += OnDisableConsume;
                
            channel.BasicConsume(queueInit, false, initConsumer);
            channel.BasicConsume(queryDisable, false, disableConsumer);
        }
    }
}
