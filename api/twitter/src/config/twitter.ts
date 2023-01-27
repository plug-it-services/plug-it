export const twitter = {
  name: 'twitter',
  authType: 'oauth2',
  icon: '/images/twitter_icon.png',
  events: [],
  actions: [
    {
      id: 'tweet',
      name: 'Publish a tweet',
      description: 'Post a tweet with the user account',
      variables: [],
      fields: [
        {
          key: 'body',
          type: 'string',
          displayName: 'Tweet body',
          description: 'The content that will be posted as a tweet',
          required: true,
        },
      ],
    },
  ],
};
