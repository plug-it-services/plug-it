export const outlook = {
  name: 'outlook',
  authType: 'oauth2',
  icon: '/images/outlook_icon.png',
  color: '#1d099F',
  events: [
    {
      id: 'mailReceived',
      name: 'E-Mail Received',
      description: 'Trigger when an address receive some native tokens',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Email Sender',
          description: 'The sender of the mail',
        },
        {
          key: 'subject',
          type: 'string',
          displayName: 'Email Subject',
          description: 'The subject of the mail',
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Email Body',
          description: 'The body content of the mail',
        },
        {
          key: 'date',
          type: 'string',
          displayName: 'Email Date/Time',
          description: 'The time at which the mail was received',
        },
        {
          key: 'id',
          type: 'string',
          displayName: 'Email id',
          description: 'The email id',
        },
      ],
      fields: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Filter',
          description: 'To check if the mail sender contains the following filter',
          required: false,
        },
        {
          key: 'subject',
          type: 'string',
          displayName: 'Subject Filter',
          description: 'To check if the mail subject contains the following filter',
          required: false,
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Body Filter',
          description: 'To check if the mail body content contains the following filter',
          required: false,
        },
        {
          key: 'inbox',
          type: 'string',
          displayName: 'Mail Folder',
          description: 'The mail folder to watch, default value: \'inbox\'',
          required: false,
        },
      ],
    },
  ],
  actions: [
    {
      id: 'email',
      name: 'Send',
      description: 'Sends an email.',
      variables: [
        {
          key: 'id',
          type: 'string',
          displayName: 'Sent Email id',
          description: 'The id of the sent email.',
        },
      ],
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
    {
      id: 'reply_email',
      name: 'Reply',
      description: 'Reply to a received email.',
      variables: [
        {
          key: 'id',
          type: 'string',
          displayName: 'Reply Email Id',
          description: 'The id of reply email sent.',
        },
      ],
      fields: [
        {
          key: 'reply_id',
          type: 'string',
          displayName: 'Id',
          description: 'The email id which you want to reply a message to.',
          required: true,
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
    {
      id: 'set_high',
      name: 'Categorize as High Importance',
      description: 'Change the category of a an email to High Importance.',
      variables: [],
      fields: [
        {
          key: 'id',
          type: 'string',
          displayName: 'Id',
          description: 'The email id which you want to change the importance.',
          required: true,
        },
      ],
    },
    {
      id: 'set_low',
      name: 'Categorize as Low Importance',
      description: 'Change the category of a an email to Low Importance.',
      variables: [],
      fields: [
        {
          key: 'id',
          type: 'string',
          displayName: 'Id',
          description: 'The email id which you want to change the importance.',
          required: true,
        },
      ],
    },
    {
      id: 'set_normal',
      name: 'Categorize as Normal Importance',
      description: 'Change the category of a an email to Normal Importance.',
      variables: [],
      fields: [
        {
          key: 'id',
          type: 'string',
          displayName: 'Id',
          description: 'The email id which you want to change the importance.',
          required: true,
        },
      ],
    },
    {
      id: 'set_not_focused',
      name: 'Categorize as Not Focused',
      description: 'Change the category of a an email to not Focused.',
      variables: [],
      fields: [
        {
          key: 'id',
          type: 'string',
          displayName: 'Id',
          description: 'The email id which you want to change the importance.',
          required: true,
        },
      ],
    },
    {
      id: 'set_focused',
      name: 'Categorize as Focused',
      description: 'Change the category of a an email to Focused.',
      variables: [],
      fields: [
        {
          key: 'id',
          type: 'string',
          displayName: 'Id',
          description: 'The email id which you want to change the importance.',
          required: true,
        },
      ],
    },
  ],
};
