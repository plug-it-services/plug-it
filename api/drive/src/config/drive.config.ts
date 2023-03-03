function buildClassicReplyConfigVariables(data_type: string): any {
  return [
    {
      key: 'fileId',
      type: 'string',
      displayName: data_type + ' ID',
      description: 'The ID of the created ' + data_type,
    },
    {
      key: 'name',
      type: 'string',
      displayName: data_type + ' name',
      description: 'The name of the created ' + data_type,
    },
    {
      key: 'driveId',
      type: 'string',
      displayName: 'Drive ID',
      description:
        'The ID of the drive where the ' + data_type + ' was created',
    },
    {
      key: 'url',
      type: 'string',
      displayName: data_type + ' URL',
      description: 'The URL of the created ' + data_type,
    },
    {
      key: 'isOwner',
      type: 'string',
      displayName: 'Is owner',
      description: 'Whether the user is the owner of the ' + data_type,
    },
    {
      key: 'isShared',
      type: 'string',
      displayName: 'Is shared',
      description: 'Whether the ' + data_type + ' is shared',
    },
    {
      key: 'isTrashed',
      type: 'string',
      displayName: 'Is trashed',
      description: 'Whether the ' + data_type + ' is trashed',
    },
    {
      key: 'isStarred',
      type: 'string',
      displayName: 'Is starred',
      description: 'Whether the ' + data_type + ' is starred',
    },
  ];
}

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
      id: 'changesOnFile',
      name: 'Changes on file',
      description:
        'Trigger when the specified file or folder changes',
      variables: [
        {
          key: 'fileId',
          type: 'string',
          displayName: 'File ID',
          description: 'The ID of the file that was changed',
        },
      ],
      fields: [
        {
          key: 'fileId',
          type: 'string',
          displayName: 'File ID',
          description: 'The ID of the file that will be watched',
          required: true,
        },
      ],
    },
  ],
  actions: [
    {
      id: 'createFile',
      name: 'Create a file',
      description: 'Create a file at the root of your drive',
      variables: buildClassicReplyConfigVariables('file'),
      fields: [
        {
          key: 'name',
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
          displayName: 'File ID',
          description: 'The ID of the file to delete',
          required: true,
        },
      ],
    },
    {
      id: 'renameFile',
      name: 'Rename a file',
      description: 'Rename a file with the provided id',
      variables: buildClassicReplyConfigVariables('file'),
      fields: [
        {
          key: 'fileId',
          type: 'string',
          displayName: 'File ID',
          description: 'The ID of the file to rename',
          required: true,
        },
        {
          key: 'name',
          type: 'string',
          displayName: 'New name',
          description: 'The new name of the file',
          required: true,
        },
      ],
    },
    {
      id: 'moveFile',
      name: 'Move a file',
      description: 'Move a file with the provided id to a destination folder',
      variables: buildClassicReplyConfigVariables('file'),
      fields: [
        {
          key: 'fileId',
          type: 'string',
          displayName: 'File ID',
          description: 'The ID of the file to move',
          required: true,
        },
        {
          key: 'destinationId',
          type: 'string',
          displayName: 'Destination ID',
          description: 'The ID of the destination folder',
          required: true,
        },
      ],
    },
    {
      id: 'copyFile',
      name: 'Copy a file',
      description: 'Copy a file with the provided id to a destination folder',
      variables: buildClassicReplyConfigVariables('file'),
      fields: [
        {
          key: 'fileId',
          type: 'string',
          displayName: 'File ID',
          description: 'The ID of the file to copy',
          required: true,
        },
        {
          key: 'destinationId',
          type: 'string',
          displayName: 'Destination ID',
          description: 'The ID of the destination folder',
          required: true,
        },
      ],
    },
    {
      id: 'shareFile',
      name: 'Share a file',
      description: 'Share a file with the provided id to a user',
      variables: [], // TODO
      fields: [
        {
          key: 'fileId',
          type: 'string',
          displayName: 'File ID',
          description: 'The ID of the file to share',
          required: true,
        },
        {
          key: 'email',
          type: 'string',
          displayName: 'Email',
          description: 'The email of the user to share the file with',
          required: true,
        },
        {
          key: 'role',
          type: 'string',
          displayName: 'Role',
          description: 'The role of the user to share the file with',
          required: true,
        },
      ],
    },
    {
      id: 'unshareFile',
      name: 'Unshare a file',
      description: 'Unshare a file with the provided id from a user',
      variables: [],
      fields: [
        {
          key: 'fileId',
          type: 'string',
          displayName: 'File ID',
          description: 'The ID of the file to unshare',
          required: true,
        },
        {
          key: 'email',
          type: 'string',
          displayName: 'Email',
          description: 'The ID of the permission to remove',
          required: true,
        },
      ],
    },
    {
      id: 'changeFilePermission',
      name: 'Change a file permission',
      description: 'Change a file permission with the provided id',
      variables: [], // TODO
      fields: [
        {
          key: 'fileId',
          type: 'string',
          displayName: 'File ID',
          description: 'The ID of the file to change the permission of',
          required: true,
        },
        {
          key: 'permissionId',
          type: 'string',
          displayName: 'Permission ID',
          description: 'The ID of the permission to change',
          required: true,
        },
        {
          key: 'role',
          type: 'string',
          displayName: 'Role',
          description: 'The new role of the user to share the file with',
          required: true,
        },
      ],
    },
    {
      id: 'getFile',
      name: 'Get a file',
      description: 'Get a file with the provided id',
      variables: buildClassicReplyConfigVariables('file'),
      fields: [
        {
          key: 'fileId',
          type: 'string',
          displayName: 'File ID',
          description: 'The ID of the file to get',
          required: true,
        },
      ],
    },
    {
      id: 'createFolder',
      name: 'Create a folder',
      description: 'Create a folder at the root of your drive',
      variables: buildClassicReplyConfigVariables('folder'),
      fields: [
        {
          key: 'name',
          type: 'string',
          displayName: 'Folder name',
          description: 'The name of the folder to create',
          required: true,
        },
      ],
    },
    {
      id: 'deleteFolder',
      name: 'Delete a folder',
      description: 'Delete a folder with the provided id',
      variables: [],
      fields: [
        {
          key: 'folderId',
          type: 'string',
          displayName: 'Folder ID',
          description: 'The ID of the folder to delete',
          required: true,
        },
      ],
    },
    {
      id: 'renameFolder',
      name: 'Rename a folder',
      description: 'Rename a folder with the provided id',
      variables: buildClassicReplyConfigVariables('folder'),
      fields: [
        {
          key: 'folderId',
          type: 'string',
          displayName: 'Folder ID',
          description: 'The ID of the folder to rename',
          required: true,
        },
        {
          key: 'name',
          type: 'string',
          displayName: 'New name',
          description: 'The new name of the folder',
          required: true,
        },
      ],
    },
    {
      id: 'moveFolder',
      name: 'Move a folder',
      description: 'Move a folder with the provided id to a destination folder',
      variables: buildClassicReplyConfigVariables('folder'),
      fields: [
        {
          key: 'folderId',
          type: 'string',
          displayName: 'Folder ID',
          description: 'The ID of the folder to move',
          required: true,
        },
        {
          key: 'destinationId',
          type: 'string',
          displayName: 'Destination ID',
          description: 'The ID of the destination folder',
          required: true,
        },
      ],
    },
    {
      id: 'copyFolder',
      name: 'Copy a folder',
      description: 'Copy a folder with the provided id to a destination folder',
      variables: buildClassicReplyConfigVariables('folder'),
      fields: [
        {
          key: 'folderId',
          type: 'string',
          displayName: 'Folder ID',
          description: 'The ID of the folder to copy',
          required: true,
        },
        {
          key: 'destinationId',
          type: 'string',
          displayName: 'Destination ID',
          description: 'The ID of the destination folder',
          required: true,
        },
      ],
    },
    {
      id: 'shareFolder',
      name: 'Share a folder',
      description: 'Share a folder with the provided id to a user',
      variables: [], // TODO
      fields: [
        {
          key: 'folderId',
          type: 'string',
          displayName: 'Folder ID',
          description: 'The ID of the folder to share',
          required: true,
        },
        {
          key: 'email',
          type: 'string',
          displayName: 'Email',
          description: 'The email of the user to share the folder with',
          required: true,
        },
        {
          key: 'role',
          type: 'string',
          displayName: 'Role',
          description: 'The role of the user to share the folder with',
          required: true,
        },
      ],
    },
    {
      id: 'unshareFolder',
      name: 'Unshare a folder',
      description: 'Unshare a folder with the provided id from a user',
      variables: [],
      fields: [
        {
          key: 'folderId',
          type: 'string',
          displayName: 'Folder ID',
          description: 'The ID of the folder to unshare',
          required: true,
        },
        {
          key: 'permissionId',
          type: 'string',
          displayName: 'Permission ID',
          description: 'The ID of the permission to remove',
          required: true,
        },
      ],
    },
    {
      id: 'changeFolderPermission',
      name: 'Change a folder permission',
      description: 'Change a folder permission with the provided id',
      variables: [], // TODO
      fields: [
        {
          key: 'folderId',
          type: 'string',
          displayName: 'Folder ID',
          description: 'The ID of the folder to change the permission of',
          required: true,
        },
        {
          key: 'permissionId',
          type: 'string',
          displayName: 'Permission ID',
          description: 'The ID of the permission to change',
          required: true,
        },
        {
          key: 'role',
          type: 'string',
          displayName: 'Role',
          description: 'The new role of the user to share the folder with',
          required: true,
        },
      ],
    },
    {
      id: 'getFolder',
      name: 'Get a folder',
      description: 'Get a folder with the provided id',
      variables: buildClassicReplyConfigVariables('folder'),
      fields: [
        {
          key: 'folderId',
          type: 'string',
          displayName: 'Folder ID',
          description: 'The ID of the folder to get',
          required: true,
        },
      ],
    },
  ],
};
