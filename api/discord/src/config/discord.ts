export default {
  name: 'discord',
  authType: 'oauth2',
  icon: '/images/discord_icon.png',
  color: '#7289da',
  events: [],
  actions: [
    {
      id: 'pm',
      name: 'Post a private message',
      description: 'Post a private message to a user',
      variables: [],
      fields: [
        {
          key: 'id',
          type: 'string',
          displayName: 'User ID',
          description: 'The ID of the user to send the message to',
          required: true,
        },
        {
          key: 'content',
          type: 'string',
          displayName: 'Message content',
          description: 'The content that will be sent to the user',
          required: true,
        },
      ],
    },
    {
      id: 'channel_message',
      name: 'Post a message inside a channel',
      description: 'Post a message inside a channel',
      variables: [],
      fields: [
        {
          key: 'id',
          type: 'string',
          displayName: 'Channel ID',
          description: 'The ID of the channel to send the message to',
          required: true,
        },
        {
          key: 'content',
          type: 'string',
          displayName: 'Message content',
          description: 'The content that will be sent inside the channel',
          required: true,
        },
      ],
    },
  ],
};
