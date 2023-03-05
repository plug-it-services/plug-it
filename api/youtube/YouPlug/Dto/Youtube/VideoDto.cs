namespace YouPlug.Dto.Youtube
{
    public class VideoDto
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string? Thumbnail { get; set; }
        public string ChannelId { get; set; }
        public string ChannelTitle { get; set; }
        public DateTime PublishedAt { get; set; }

    }
}
