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
  actions: [],
};
