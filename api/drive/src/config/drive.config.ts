export default {
  name: 'drive',
  authType: 'oauth2',
  icon: '/images/drive_icon.png',
  color: '#ffffff',
  events: [
    {
      id: 'changesOnMyDrive',
      name: 'Changes on my drive',
      description:
        'Trigger when a file or folder is change in your whole drive',
      variables: [
        {
          key: 'fileId',
          type: 'string',
          displayName: 'File ID',
          description: 'The ID of the file that was changed',
        },
      ],
      fields: [],
    },
    {
      id: 'changesOnMyDrive',
      name: 'Changes on my drive',
      description:
        'Trigger when a file or folder is change in your whole drive',
      variables: [],
      fields: [
        {
          key: 'fileId',
          type: 'string',
          displayName: 'File ID',
          description: 'The ID of the file that will be watched',
        },
      ],
    },
  ],
  actions: [
    {
      id: 'createFile',
      name: 'Create a file',
      description: 'Create a file at the root of your drive',
      variables: [],
      fields: [
        {
          key: 'filename',
          type: 'string',
          displayName: 'Filename',
          description: 'The name of the file to create',
          required: true,
        },
      ],
    },
    {
      id: 'deleteFile',
      name: 'Delete a file',
      description: 'Delete a file with the provided id',
      variables: [],
      fields: [
        {
          key: 'fileId',
          type: 'string',
          displayName: 'Filename',
          description: 'The id of the file to delete',
          required: true,
        },
      ],
    },
  ],
};
