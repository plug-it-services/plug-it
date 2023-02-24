namespace YouPlug.Dto.Rabbit
{
    public class RabbitDto
    {

        public class Field
        {
            public string key { get; set; }
            public string value { get; set; }
        }

        public class Variable
        {
            public string key { get; set; }
            public string value { get; set; }
        }

        public class UserHeaderDto
        {
            public int id { get; set; }
            public string email { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
        }

        public class PlugDisabledDto
        {
            public string plugId { get; set; }
            public string eventId { get; set; }
            public int userId { get; set; }
        }

        public class EventInitializeDto
        {
            public string plugId { get; set; }
            public string eventId { get; set; }
            public int userId { get; set; }
            public Field[] fields { get; set; }
        }

        public class ActionFinishedDto
        {
            public string serviceName { get; set; }
            public string actionId { get; set; }
            public string plugId { get; set; }
            public int userId { get; set; }
            public string runId { get; set; }
            public Variable[] variables { get; set; }
        }

        public class EventFiredDto
        {
            public string serviceName { get; set; }
            public string eventId { get; set; }
            public string plugId { get; set; }
            public int userId { get; set; }
            public Variable[] variables { get; set; }
        }

        public class ActionTriggerDto
        {
            public string actionId { get; set; }
            public string plugId { get; set; }
            public int userId { get; set; }
            public string runId { get; set; }
            public Field[] fields { get; set; }
        }

        public class Step
        {
            public string serviceName { get; set; }
            public string id { get; set; }
            public Field[] fields { get; set; }
        }

        public class PlugSubmitDto
        {
            public string name { get; set; }
            public bool enabled { get; set; }
            public Step @event { get; set; }
            public Step[] actions { get; set; }
        }

        public class PlugDescriptionDto
        {
            public string id { get; set; }
            public string name { get; set; }
            public bool enabled { get; set; }
            public Step @event { get; set; }
            public Step[] actions { get; set; }
        }

    }
}
