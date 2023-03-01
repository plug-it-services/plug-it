using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using YouPlug.Dto.Youtube;
using YouPlug.Models;
using static YouPlug.Dto.Rabbit.RabbitDto;
using JsonSerializer = System.Text.Json.JsonSerializer;

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
        private string? actionTrigger;
        private string? actionFinish;

        public RabbitService(Uri hostUri)
        {
            queueInit = Environment.GetEnvironmentVariable("EVENT_INITIALIZATION_QUEUE", EnvironmentVariableTarget.Process);
            queryDisable = Environment.GetEnvironmentVariable("EVENT_DISABLED_QUEUE", EnvironmentVariableTarget.Process);
            eventQueue = Environment.GetEnvironmentVariable("EVENT_QUEUE", EnvironmentVariableTarget.Process);
            actionTrigger = Environment.GetEnvironmentVariable("ACTION_TRIGGERS", EnvironmentVariableTarget.Process);
            actionFinish = Environment.GetEnvironmentVariable("ACTION_FINISH", EnvironmentVariableTarget.Process);

            if (string.IsNullOrWhiteSpace(queueInit))
                throw new Exception("Unable to recover EVENT_INITIALIZATION_QUEUE env var!");
            if (string.IsNullOrWhiteSpace(queryDisable))
                throw new Exception("Unable to recover EVENT_DISABLED_QUEUE env var!");
            if (string.IsNullOrWhiteSpace(eventQueue))
                throw new Exception("Unable to recover EVENT_QUEUE env var!");
            if (string.IsNullOrWhiteSpace(actionTrigger))
                throw new Exception("Unable to recover ACTION_TRIGGERS env var!");
            if (string.IsNullOrWhiteSpace(actionFinish))
                throw new Exception("Unable to recover ACTION_FINISH env var!");

            Console.WriteLine("RabbitMQ: Connecting to " + hostUri);
            factory = new ConnectionFactory() { Uri = hostUri };
            connection = factory.CreateConnection();
            channel = connection.CreateModel();

            Console.WriteLine("Init: " + queueInit);
            Console.WriteLine("Disable: " + queryDisable);
            Console.WriteLine("Event: " + eventQueue);
            Console.WriteLine("Action Trigger: " + actionTrigger);
            Console.WriteLine("Action Finish: " + actionFinish);

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

            channel.QueueDeclare(queue: actionTrigger,
                     durable: true,
                     exclusive: false,
                     autoDelete: false,
                     arguments: null);
            channel.QueueBind(actionTrigger, "amq.direct", actionTrigger);
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
                            channelId = message.fields.First(x => x.key == "channelId").value,
                            userId = message.userId,
                            plugId = message.plugId,
                            lastVideoDate = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds()
                        };
                        Program.fetcherService.AddNewVideoFromChannel(model);
                        handled = true;
                        break;
                    case "newVideoFromMyChannel":
                        Console.WriteLine("New video from my channel {0} for user {1} for plugId {2}!", message.eventId, message.userId, message.plugId);
                        NewVideoFromMyChannelModel newVideoFromMyChannel = new()
                        {
                            userId = message.userId,
                            plugId = message.plugId,
                            lastVideoDate = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds()
                        };
                        Program.fetcherService.AddNewVideoFromMyChannel(newVideoFromMyChannel);
                        handled = true;
                        break;
                    case "newStreamFromChannel":
                        Console.WriteLine("New stream from channel {0} for user {1} for plugId {2}!", message.eventId, message.userId, message.plugId);
                        NewStreamFromChannelModel newStreamFromChannel = new()
                        {
                            channelId = message.fields.First(x => x.key == "channelId").value,
                            userId = message.userId,
                            plugId = message.plugId,
                            lastStreamDate = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds()
                        };
                        Program.fetcherService.AddNewStreamFromChannel(newStreamFromChannel);
                        handled = true;
                        break;
                    case "newStreamFromMyChannel":
                        Console.WriteLine("New stream from my channel {0} for user {1} for plugId {2}!", message.eventId, message.userId, message.plugId);
                        NewStreamFromMyChannelModel newStreamFromMyChannel = new()
                        {
                            userId = message.userId,
                            plugId = message.plugId,
                            lastStreamDate = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds()
                        };
                        Program.fetcherService.AddNewStreamFromMyChannel(newStreamFromMyChannel);
                        handled = true;
                        break;
                    case "newUpcomingFromChannel":
                        Console.WriteLine("New upcoming from channel {0} for user {1} for plugId {2}!", message.eventId, message.userId, message.plugId);
                        NewUpcomingFromChannelModel newUpcomingFromChannel = new()
                        {
                            channelId = message.fields.First(x => x.key == "channelId").value,
                            userId = message.userId,
                            plugId = message.plugId,
                            lastUpcomingDate = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds()
                        };
                        Program.fetcherService.AddNewUpcomingFromChannel(newUpcomingFromChannel);
                        handled = true;
                        break;
                    case "newUpcomingFromMyChannel":
                        Console.WriteLine("New upcoming from my channel {0} for user {1} for plugId {2}!", message.eventId, message.userId, message.plugId);
                        NewUpcomingFromMyChannelModel newUpcomingFromMyChannel = new()
                        {
                            userId = message.userId,
                            plugId = message.plugId,
                            lastUpcomingDate = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds()
                        };
                        Program.fetcherService.AddNewUpcomingFromMyChannel(newUpcomingFromMyChannel);
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
                Console.WriteLine(ex.ToString());
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
                    case "newVideoFromMyChannel":
                        Program.fetcherService.RemoveNewVideoFromMyChannel(message.userId, message.plugId);
                        handled = true;
                        break;
                    case "newStreamFromChannel":
                        Program.fetcherService.RemoveNewStreamFromChannel(message.userId, message.plugId);
                        handled = true;
                        break;
                    case "newStreamFromMyChannel":
                        Program.fetcherService.RemoveNewStreamFromMyChannel(message.userId, message.plugId);
                        handled = true;
                        break;
                    case "newUpcomingFromChannel":
                        Program.fetcherService.RemoveNewUpcomingFromChannel(message.userId, message.plugId);
                        handled = true;
                        break;
                    case "newUpcomingFromMyChannel":
                        Program.fetcherService.RemoveNewUpcomingFromMyChannel(message.userId, message.plugId);
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
                Console.WriteLine(ex.ToString());
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

        private void OnActionRequested(object? sender, BasicDeliverEventArgs ea)
        {
            Console.WriteLine("Received action requested event");
            bool handled = false;
            ActionTriggerDto? message = null;
            ActionFinishedDto? response = null;

            try
            {
                message = ReadMessage<ActionTriggerDto>(ea);
                if (message == null)
                    throw new Exception("Unable to deserialize message");

                Console.WriteLine("Action requested {0} for user {1}...", message.actionId, message.userId);

                var userFetcher = Program.fetcherService?.GetUserFetcher(message.userId);

                if (userFetcher == null)
                    throw new Exception("The user {0} don't seems to be connected??");

                switch (message.actionId)
                {
                    case "getMyChannelId":
                        Console.WriteLine("Getting channel id for user {0}", message.userId);
                        response = new ActionFinishedDto()
                        {
                            actionId = message.actionId,
                            userId = message.userId,
                            plugId = message.plugId,
                            runId = message.runId,
                            serviceName = "youtube",
                            variables = new Variable[] { new() { key = "channelId", value = userFetcher.GetMyOwnChannelId() } }
                        };
                        handled = true;
                        break;
                    case "likeVideo":
                        Console.WriteLine("Liking video {0}", message.fields.First(x => x.key == "videoId").value + " for user " + message.userId);
                        response = new ActionFinishedDto()
                        {
                            actionId = message.actionId,
                            userId = message.userId,
                            plugId = message.plugId,
                            runId = message.runId,
                            serviceName = "youtube",
                            variables = userFetcher.LikeVideo(message.fields.First(x => x.key == "videoId").value)
                        };
                        handled = true;
                        break;
                    case "dislikeVideo":
                        Console.WriteLine("Disliking video {0}", message.fields.First(x => x.key == "videoId").value + " for user " + message.userId);
                        response = new ActionFinishedDto()
                        {
                            actionId = message.actionId,
                            userId = message.userId,
                            plugId = message.plugId,
                            runId = message.runId,
                            serviceName = "youtube",
                            variables = userFetcher.DislikeVideo(message.fields.First(x => x.key == "videoId").value)
                        };
                        handled = true;
                        break;
                    case "removeReactionFromVideo":
                        Console.WriteLine("Removing reaction from video {0}", message.fields.First(x => x.key == "videoId").value + " for user " + message.userId);
                        response = new ActionFinishedDto()
                        {
                            actionId = message.actionId,
                            userId = message.userId,
                            plugId = message.plugId,
                            runId = message.runId,
                            serviceName = "youtube",
                            variables = userFetcher.RemoveReactionToVideo(message.fields.First(x => x.key == "videoId").value)
                        };
                        handled = true;
                        break;
                    case "subscribeToChannel":
                        Console.WriteLine("Subscribing to channel {0}", message.fields.First(x => x.key == "channelId").value + " for user " + message.userId);
                        response = new ActionFinishedDto()
                        {
                            actionId = message.actionId,
                            userId = message.userId,
                            plugId = message.plugId,
                            runId = message.runId,
                            serviceName = "youtube",
                            variables = userFetcher.SubscribeToChannel(message.fields.First(x => x.key == "channelId").value)
                        };
                        handled = true;
                        break;
                    case "unsubscribeFromChannel":
                        Console.WriteLine("Unsubscribing from channel {0}", message.fields.First(x => x.key == "channelId").value + " for user " + message.userId);
                        response = new ActionFinishedDto()
                        {
                            actionId = message.actionId,
                            userId = message.userId,
                            plugId = message.plugId,
                            runId = message.runId,
                            serviceName = "youtube",
                            variables = userFetcher.UnsubscribeFromChannel(message.fields.First(x => x.key == "channelId").value)
                        };
                        handled = true;
                        break;
                    case "createPlaylist":
                        Console.WriteLine("Creating playlist {0} ({1}) for user {2}",
                            message.fields.First(x => x.key == "playlistName").value,
                            message.fields.First(x => x.key == "playlistDescription").value,
                            message.userId);
                        response = new ActionFinishedDto()
                        {
                            actionId = message.actionId,
                            userId = message.userId,
                            plugId = message.plugId,
                            runId = message.runId,
                            serviceName = "youtube",
                            variables = userFetcher.CreatePlaylist(
                                message.fields.First(x => x.key == "playlistName").value,
                                message.fields.First(x => x.key == "playlistDescription").value)
                        };
                        handled = true;
                        break;
                    case "deletePlaylist":
                        Console.WriteLine("Deleting playlist {0} for user {1}", message.fields.First(x => x.key == "playlistId").value, message.userId);
                        response = new ActionFinishedDto()
                        {
                            actionId = message.actionId,
                            userId = message.userId,
                            plugId = message.plugId,
                            runId = message.runId,
                            serviceName = "youtube",
                            variables = userFetcher.RemovePlaylist(message.fields.First(x => x.key == "playlistId").value)
                        };
                        handled = true;
                        break;
                    case "addVideoToPlaylist":
                        Console.WriteLine("Adding video {0} to playlist {1} for user {2}",
                            message.fields.First(x => x.key == "videoId").value,
                            message.fields.First(x => x.key == "playlistId").value,
                            message.userId);
                        response = new ActionFinishedDto()
                        {
                            actionId = message.actionId,
                            userId = message.userId,
                            plugId = message.plugId,
                            runId = message.runId,
                            serviceName = "youtube",
                            variables = userFetcher.AddToPlaylist(
                                message.fields.First(x => x.key == "playlistId").value,
                                message.fields.First(x => x.key == "videoId").value)
                        };
                        handled = true;
                        break;
                    case "removeVideoFromPlaylist":
                        Console.WriteLine("Removing video {0} from playlist {1} for user {2}",
                            message.fields.First(x => x.key == "videoId").value,
                            message.fields.First(x => x.key == "playlistId").value,
                            message.userId);
                        response = new ActionFinishedDto()
                        {
                            actionId = message.actionId,
                            userId = message.userId,
                            plugId = message.plugId,
                            runId = message.runId,
                            serviceName = "youtube",
                            variables = userFetcher.RemoveFromPlaylist(
                                message.fields.First(x => x.key == "playlistId").value,
                                message.fields.First(x => x.key == "videoId").value)
                        };
                        handled = true;
                        break;
                    case "removeComment":
                        Console.WriteLine("Removing comment {0} for user {1}", message.fields.First(x => x.key == "commentId").value, message.userId);
                        response = new ActionFinishedDto()
                        {
                            actionId = message.actionId,
                            userId = message.userId,
                            plugId = message.plugId,
                            runId = message.runId,
                            serviceName = "youtube",
                            variables = userFetcher.DeleteComment(message.fields.First(x => x.key == "commentId").value)
                        };
                        handled = true;
                        break;
                    case "postComment":
                        Console.WriteLine("Posting comment {0} on video {1} for user {2}",
                            message.fields.First(x => x.key == "commentText").value,
                            message.fields.First(x => x.key == "videoId").value,
                            message.userId);
                        response = new ActionFinishedDto()
                        {
                            actionId = message.actionId,
                            userId = message.userId,
                            plugId = message.plugId,
                            runId = message.runId,
                            serviceName = "youtube",
                            variables = userFetcher.PublishComment(
                                message.fields.First(x => x.key == "videoId").value,
                                message.fields.First(x => x.key == "commentText").value)
                        };
                        handled = true;
                        break;
                    case "postReply":
                        Console.WriteLine("Posting reply {0} on comment {1} for user {2}",
                            message.fields.First(x => x.key == "commentText").value,
                            message.fields.First(x => x.key == "commentId").value,
                            message.userId);
                        response = new ActionFinishedDto()
                        {
                            actionId = message.actionId,
                            userId = message.userId,
                            plugId = message.plugId,
                            runId = message.runId,
                            serviceName = "youtube",
                            variables = userFetcher.PublishReply(
                                message.fields.Where(x => x.key == "videoId").First().value,
                                message.fields.Where(x => x.key == "commentId").First().value,
                                message.fields.Where(x => x.key == "commentText").First().value)
                        };
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
                Console.WriteLine(ex.ToString());
                handled = false; // Just to be over sure
            }

            if (!handled)
            {
                Console.WriteLine("Error (RabbitService) : " + "Unable to handle message");
                channel.BasicNack(ea.DeliveryTag, false, false);
                return;
            }

            if (response != null)
            {
                Console.WriteLine("Sending response for action {0} for user {1}...", message.actionId, message.userId);
                var body = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(response));
                channel.BasicPublish("amq.direct", actionFinish, null, body);
            }

            channel.BasicAck(ea.DeliveryTag, false);
            Console.WriteLine("Action {0} for user {1} finished!", message.actionId, message.userId);
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
                new Variable() { key = "channelId", value = videoDto.ChannelId },
                new Variable() { key = "videoTitle", value = videoDto.Title },
                new Variable() { key = "videoId", value = videoDto.Id },
                new Variable() { key = "videoDescription", value = videoDto.Description },
            });
        }

        public void OnNewVideoFromMyChannel(NewVideoFromMyChannelModel model, VideoDto videoDto)
        {
            if (channel == null)
            {
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                return;
            }

            FireEvent("newVideoFromMyChannel", model.plugId, model.userId, new Variable[] {
                new Variable() { key = "channelTitle", value = videoDto.ChannelTitle },
                new Variable() { key = "channelId", value = videoDto.ChannelId },
                new Variable() { key = "videoTitle", value = videoDto.Title },
                new Variable() { key = "videoId", value = videoDto.Id },
                new Variable() { key = "videoDescription", value = videoDto.Description },
            });
        }

        public void OnNewStreamFromChannel(NewStreamFromChannelModel model, VideoDto streamDto)
        {
            if (channel == null)
            {
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                return;
            }

            FireEvent("newStreamFromChannel", model.plugId, model.userId, new Variable[] {
                new Variable() { key = "channelTitle", value = streamDto.ChannelTitle },
                new Variable() { key = "channelId", value = streamDto.ChannelId },
                new Variable() { key = "streamTitle", value = streamDto.Title },
                new Variable() { key = "streamId", value = streamDto.Id },
                new Variable() { key = "streamDescription", value = streamDto.Description },
            });
        }

        public void OnNewStreamFromMyChannel(NewStreamFromMyChannelModel model, VideoDto streamDto)
        {
            if (channel == null)
            {
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                return;
            }

            FireEvent("newStreamFromMyChannel", model.plugId, model.userId, new Variable[] {
                new Variable() { key = "channelTitle", value = streamDto.ChannelTitle },
                new Variable() { key = "channelId", value = streamDto.ChannelId },
                new Variable() { key = "streamTitle", value = streamDto.Title },
                new Variable() { key = "streamId", value = streamDto.Id },
                new Variable() { key = "streamDescription", value = streamDto.Description },
            });
        }

        public void OnNewUpcomingFromChannel(NewUpcomingFromChannelModel model, VideoDto streamDto)
        {
            if (channel == null)
            {
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                return;
            }

            FireEvent("newUpcomingStreamFromChannel", model.plugId, model.userId, new Variable[] {
                new Variable() { key = "channelTitle", value = streamDto.ChannelTitle },
                new Variable() { key = "channelId", value = streamDto.ChannelId },
                new Variable() { key = "streamTitle", value = streamDto.Title },
                new Variable() { key = "streamId", value = streamDto.Id },
                new Variable() { key = "streamDescription", value = streamDto.Description },
            });
        }

        public void OnNewUpcomingFromMyChannel(NewUpcomingFromMyChannelModel model, VideoDto streamDto)
        {
            if (channel == null)
            {
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                return;
            }

            FireEvent("newUpcomingStreamFromMyChannel", model.plugId, model.userId, new Variable[] {
                new Variable() { key = "channelTitle", value = streamDto.ChannelTitle },
                new Variable() { key = "channelId", value = streamDto.ChannelId },
                new Variable() { key = "streamTitle", value = streamDto.Title },
                new Variable() { key = "streamId", value = streamDto.Id },
                new Variable() { key = "streamDescription", value = streamDto.Description },
            });
        }

        public void FireEvent(string eventId, string plugId, int userId, Variable[] variables)
        {
            if (channel == null)
            {
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
            if (channel == null)
            {
                Console.WriteLine("Error (RabbitService) : " + "Channel is null");
                return;
            }

            var initConsumer = new EventingBasicConsumer(channel);
            initConsumer.Received += OnInitConsume;

            var disableConsumer = new EventingBasicConsumer(channel);
            disableConsumer.Received += OnDisableConsume;

            var eventTrigger = new EventingBasicConsumer(channel);
            eventTrigger.Received += OnActionRequested;

            channel.BasicConsume(queueInit, false, initConsumer);
            channel.BasicConsume(queryDisable, false, disableConsumer);
            channel.BasicConsume(actionTrigger, false, eventTrigger);
            Console.WriteLine("RabbitMQ: Started!");
        }
    }
}
