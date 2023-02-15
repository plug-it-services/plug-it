using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;


namespace YouPlug.Models
{
    internal class PlugData
    {
        internal enum PlugAuthType
        {
            None, ApiKey, ClientSecret, OAuth2
        }

        internal enum VariableType
        {
            String, Number, Date
        }

        internal class PlugField
        {
            [JsonPropertyName("key")] public string Key { get; set; }
            [JsonPropertyName("type")] public string Type { get; set; }
            [JsonPropertyName("displayName")] public string DisplayName { get; set; }
            [JsonPropertyName("description")] public string Description { get; set; }
            [JsonPropertyName("required")] public bool Required { get; set; }

            public PlugField(string key, string type, string displayName, string description, bool required)
            {
                Key = key;
                Type = type;
                DisplayName = displayName;
                Description = description;
                Required = required;
            }
        }

        internal class PlugEvent
        {
            [JsonPropertyName("id")] public string Id { get; set; }
            [JsonPropertyName("name")] public string Name { get; set; }
            [JsonPropertyName("description")] public string Description { get; set; }
            [JsonPropertyName("variables")] public List<PlugVariable> Variables { get; set; }
            [JsonPropertyName("fields")] public List<PlugField> Fields { get; set; }

            public PlugEvent(string id, string name, string description, List<PlugVariable> variables, List<PlugField> fields)
            {
                Id = id;
                Name = name;
                Description = description;
                Variables = variables;
                Fields = fields;
            }
        }

        internal class PlugVariable
        {
            [JsonPropertyName("key")] public string Key { get; set; }
            [JsonPropertyName("type")] public VariableType Type { get; set; }
            [JsonPropertyName("displayName")] public string DisplayName { get; set; }
            [JsonPropertyName("description")] public string Description { get; set; }

            public PlugVariable(string key, VariableType type, string displayName, string description)
            {
                Key = key;
                Type = type;
                DisplayName = displayName;
                Description = description;
            }
        }

        internal class PlugAction
        {
            [JsonPropertyName("id")] public string Id { get; set; }
            [JsonPropertyName("name")] public string Name { get; set; }
            [JsonPropertyName("description")] public string Description { get; set; }
            [JsonPropertyName("variables")] public List<PlugVariable> Variables { get; set; }
            [JsonPropertyName("fields")] public List<PlugField> Fields { get; set; }

            public PlugAction(string id, string name, string description, List<PlugVariable> variables, List<PlugField> fields)
            {
                Id = id;
                Name = name;
                Description = description;
                Variables = variables;
                Fields = fields;
            }
        }

        [JsonPropertyName("name")] public string Name { get; set; }
        [JsonPropertyName("authType")] public PlugAuthType AuthType { get; set; }
        [JsonPropertyName("icon")] public string Icon { get; set; }
        [JsonPropertyName("color")] public string Color { get; set; }
        [JsonPropertyName("events")] public List<PlugEvent> Events { get; set; }
        [JsonPropertyName("actions")] public List<PlugAction> Actions { get; set; }

        public PlugData(string name, PlugAuthType authType, string icon, string color)
        {
            Name = name;
            AuthType = authType;
            Icon = icon;
            Color = color;
            Events = new List<PlugEvent>();
            Actions = new List<PlugAction>();
        }

        private static JsonSerializerOptions GetJsonSerializerOptions()
        {
            return new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Converters =
                {
                    new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
                },
                WriteIndented = true
            };
        }

        public static PlugData? FromJson(string content)
        {
            return JsonSerializer.Deserialize<PlugData>(content, GetJsonSerializerOptions());
        }

        public static string ToJson(PlugData data)
        {
            return JsonSerializer.Serialize(data, GetJsonSerializerOptions());
        }

        public void AddEvent(string id, string name, string description, List<PlugVariable> variables, List<PlugField> fields)
        {
            if (Events.Any(e => e.Id == id))
                throw new ArgumentException($"Event with id {id} already exists");
            Events.Add(new PlugEvent(id, name, description, variables, fields));
        }

        public void AddAction(string id, string name, string description, List<PlugVariable> variables, List<PlugField> fields)
        {
            if (Actions.Any(e => e.Id == id))
                throw new ArgumentException($"Action with id {id} already exists");
            Actions.Add(new PlugAction(id, name, description, variables, fields));
        }
    }
}
