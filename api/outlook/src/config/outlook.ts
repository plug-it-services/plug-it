export const outlook = {
  name: 'outlook',
  authType: 'oauth2',
  icon: '/images/outlook_icon.png',
  color: '#1d099F',
  events: [],
  actions: [
    {
      id: 'email',
      name: 'Send an email',
      description: 'Sends an email automatically',
      variables: [],
      fields: [
        {
          key: 'to',
          type: 'string',
          displayName: 'To',
          description: 'The email address which you want to send a message to.',
          required: true,
        },
        {
          key: 'object',
          type: 'string',
          displayName: 'Object',
          description: 'The object of the mail to send.',
          required: false,
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Body',
          description: 'The content of the mail to send.',
          required: false,
        },
      ],
    },
  ],
};
