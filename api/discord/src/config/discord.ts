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
      variables: [
        {
          key: 'message_id',
          type: 'string',
          displayName: 'Message ID',
          description: 'The ID of the message that was sent',
        },
      ],
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
      variables: [
        {
          key: 'message_id',
          type: 'string',
          displayName: 'Message ID',
          description: 'The ID of the message that was sent',
        },
      ],
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
    {
      id: 'public_thread_create',
      name: 'Create a new public thread',
      description: 'Create a new public thread related to a message',
      variables: [
        {
          key: 'threadId',
          type: 'string',
          displayName: 'Thread ID',
          description: 'The ID of the thread that was created',
        },
      ],
      fields: [
        {
          key: 'message_id',
          type: 'string',
          displayName: 'Message ID',
          description: 'The ID of the message to create the thread from',
          required: true,
        },
        {
          key: 'name',
          type: 'string',
          displayName: 'Thread name',
          description: 'The name of the thread',
          required: true,
        },
        {
          key: 'reason',
          type: 'string',
          displayName: 'Thread reason',
          description: 'The reason for creating the thread',
          required: false,
        },
        {
          key: 'auto_archive_duration',
          type: 'number',
          displayName: 'Thread auto archive duration',
          description:
            'The duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080',
          required: false,
        },
        {
          key: 'rate_limit_per_user',
          type: 'number',
          displayName: 'Thread rate limit per user',
          description:
            'Amount of seconds a user has to wait before sending another message (0-21600)',
          required: false,
        },
      ],
    },
    {
      id: 'private_thread_create',
      name: 'Create a new private thread',
      description: 'Create a new private thread inside a channel',
      variables: [
        {
          key: 'threadId',
          type: 'string',
          displayName: 'Thread ID',
          description: 'The ID of the thread that was created',
        },
      ],
      fields: [
        {
          key: 'channel_id',
          type: 'string',
          displayName: 'Channel ID',
          description: 'The ID of the channel to create the thread in',
          required: true,
        },
        {
          key: 'name',
          type: 'string',
          displayName: 'Thread name',
          description: 'The name of the thread',
          required: true,
        },
        {
          key: 'reason',
          type: 'string',
          displayName: 'Thread reason',
          description: 'The reason for creating the thread',
          required: false,
        },
        {
          key: 'auto_archive_duration',
          type: 'number',
          displayName: 'Thread auto archive duration',
          description:
            'The duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080',
          required: false,
        },
        {
          key: 'rate_limit_per_user',
          type: 'number',
          displayName: 'Thread rate limit per user',
          description:
            'Amount of seconds a user has to wait before sending another message (0-21600)',
          required: false,
        },
      ],
    },
    {
      id: 'thread_delete',
      name: 'Delete a thread',
      description: 'Delete a thread',
      variables: [],
      fields: [
        {
          key: 'thread_id',
          type: 'string',
          displayName: 'Thread ID',
          description: 'The ID of the thread to delete',
          required: true,
        },
      ],
    },
    {
      id: 'send_message_thread',
      name: 'Send a message inside a thread',
      description: 'Send a message inside a thread',
      variables: [
        {
          key: 'message_id',
          type: 'string',
          displayName: 'Message ID',
          description: 'The ID of the message that was sent',
        },
      ],
      fields: [
        {
          key: 'thread_id',
          type: 'string',
          displayName: 'Thread ID',
          description: 'The ID of the thread to send the message to',
          required: true,
        },
        {
          key: 'message',
          type: 'string',
          displayName: 'Message content',
          description: 'The content of the message to send',
          required: true,
        },
      ],
    },
    {
      id: 'archive_thread',
      name: 'Archive a thread',
      description: 'Archive a thread',
      variables: [],
      fields: [
        {
          key: 'thread_id',
          type: 'string',
          displayName: 'Thread ID',
          description: 'The ID of the thread to archive',
          required: true,
        },
      ],
    },
    {
      id: 'unarchive_thread',
      name: 'UnArchive a thread',
      description: 'UnArchive a thread',
      variables: [],
      fields: [
        {
          key: 'thread_id',
          type: 'string',
          displayName: 'Thread ID',
          description: 'The ID of the thread to unarchive',
          required: true,
        },
      ],
    },
    {
      id: 'lock_thread',
      name: 'Lock a thread',
      description: 'Lock a thread',
      variables: [],
      fields: [
        {
          key: 'thread_id',
          type: 'string',
          displayName: 'Thread ID',
          description: 'The ID of the thread to lock',
          required: true,
        },
      ],
    },
    {
      id: 'unlock_thread',
      name: 'UnLock a thread',
      description: 'UnLock a thread',
      variables: [],
      fields: [
        {
          key: 'thread_id',
          type: 'string',
          displayName: 'Thread ID',
          description: 'The ID of the thread to unlock',
          required: true,
        },
      ],
    },
    {
      id: 'reply_message',
      name: 'Reply to a message',
      description: 'Reply to a message',
      variables: [
        {
          key: 'message_id',
          type: 'string',
          displayName: 'Message ID',
          description: 'The ID of the message that was sent',
        },
      ],
      fields: [
        {
          key: 'message_id',
          type: 'string',
          displayName: 'Message ID',
          description: 'The ID of the message to reply to',
          required: true,
        },
        {
          key: 'message',
          type: 'string',
          displayName: 'Message content',
          description: 'The content of the message to send',
          required: true,
        },
      ],
    },
    {
      id: 'react_to_message',
      name: 'React to a message',
      description: 'Send a reaction to a message inside a channel',
      variables: [],
      fields: [
        {
          key: 'message_id',
          type: 'string',
          displayName: 'Message ID',
          description: 'The ID of the message to react to',
          required: true,
        },
        {
          key: 'reaction',
          type: 'string',
          displayName: 'Reaction',
          description: 'The reaction to send',
          required: true,
        },
      ],
    },
    {
      id: 'publish_message',
      name: 'Publish a message',
      description:
        'Publish a message inside a channel to other followed channels',
      variables: [],
      fields: [
        {
          key: 'message_id',
          type: 'string',
          displayName: 'Message ID',
          description: 'The ID of the message to publish',
          required: true,
        },
      ],
    },
    {
      id: 'delete_message',
      name: 'Delete a message',
      description: 'Delete a message inside a channel',
      variables: [],
      fields: [
        {
          key: 'message_id',
          type: 'string',
          displayName: 'Message ID',
          description: 'The ID of the message to delete',
          required: true,
        },
      ],
    },
    {
      id: 'add_member_to_thread',
      name: 'Add a member to a thread',
      description: 'Add a member to a thread',
      variables: [],
      fields: [
        {
          key: 'thread_id',
          type: 'string',
          displayName: 'Thread ID',
          description: 'The ID of the thread to unlock',
          required: true,
        },
        {
          key: 'user_id',
          type: 'string',
          displayName: 'User ID',
          description: 'The ID of the user to add to the thread',
          required: true,
        },
      ],
    },
    {
      id: 'remove_member_from_thread',
      name: 'Remove a member from a thread',
      description: 'Remove a member from a thread',
      variables: [],
      fields: [
        {
          key: 'thread_id',
          type: 'string',
          displayName: 'Thread ID',
          description: 'The ID of the thread to unlock',
          required: true,
        },
        {
          key: 'user_id',
          type: 'string',
          displayName: 'User ID',
          description: 'The ID of the user to remove from the thread',
          required: true,
        },
      ],
    },
  ],
};
