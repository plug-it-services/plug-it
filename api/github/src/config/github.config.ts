export default {
  name: 'github',
  authType: 'oauth2',
  icon: '/images/github_icon.png',
  color: '#080808',
  events: [
    // Organization Events
    {
      id: 'orgPush',
      name: 'Organization Push',
      description:
        'Trigger when a git push event occurs on the specified organization.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The name of the repository where the github event occured.',
        },
        {
          key: 'commits',
          type: 'string',
          displayName: 'Commit Messages',
          description: 'A well formated list of the commit messages pushed.',
        },
      ],
      fields: [
        {
          key: 'org',
          type: 'string',
          displayName: 'Organization Name',
          description:
            'The organization name (will only watch public organization repositories).',
          required: true,
        },
      ],
    },
    {
      id: 'orgStarCreated',
      name: 'Starred Repository in Organization',
      description:
        'Trigger when a repository has been starred by someone in the specified organization.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The name of the repository where the github event occured.',
        },
      ],
      fields: [
        {
          key: 'org',
          type: 'string',
          displayName: 'Organization Name',
          description:
            'The organization name (must be a public organization or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'orgStarDeleted',
      name: 'Un-Starred Repository in Organization',
      description:
        'Trigger when a repository has been un-starred by someone in the specified organization.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The name of the repository where the github event occured.',
        },
      ],
      fields: [
        {
          key: 'org',
          type: 'string',
          displayName: 'Organization Name',
          description:
            'The organization name (must be a public organization or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'orgAll',
      name: 'Organization Events',
      description:
        'Trigger when any git event occurs on the specified organization.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The name of the repository where the github event occured.',
        },
        {
          key: 'event',
          type: 'string',
          displayName: 'Formatted Event',
          description:
            'A well formatted text description of the github event that occured.',
        },
      ],
      fields: [
        {
          key: 'org',
          type: 'string',
          displayName: 'Organization Name',
          description:
            'The organization name (must be a public organization or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'orgCustom',
      name: 'Organization Custom Events',
      description:
        'Trigger when the specified git events occurs on the specified organization.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The name of the repository where the github event occured.',
        },
        {
          key: 'event',
          type: 'string',
          displayName: 'Formatted Event',
          description:
            'A well formatted text description of the github event that occured.',
        },
      ],
      fields: [
        {
          key: 'org',
          type: 'string',
          displayName: 'Organization Name',
          description:
            'The organization name (must be a public organization or you must be the owner of it).',
          required: true,
        },
        {
          key: 'events',
          type: 'string',
          displayName: 'Events',
          description:
            'The github events to watch on the organization separated by a comma (refer to the github documentation for event labels).',
          required: true,
        },
      ],
    },
    {
      id: 'orgPROpened',
      name: 'Pull Request Created Organization',
      description:
        'Trigger when a pull request is openened or reopened by someone in the specified organization.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The name of the repository where the github event occured.',
        },
        {
          key: 'number',
          type: 'string',
          displayName: 'Pull Request Number',
          description: 'The number of the pull request.',
        },
        {
          key: 'title',
          type: 'string',
          displayName: 'Pull Request Title',
          description: 'The title of the pull request.',
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Pull Request Body',
          description: 'The body content of the pull request.',
        },
      ],
      fields: [
        {
          key: 'org',
          type: 'string',
          displayName: 'Organization Name',
          description:
            'The organization name (must be a public organization or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'orgPRClosed',
      name: 'Pull Request Closed Organization',
      description:
        'Trigger when a pull request is closed by someone in the specified organization.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The name of the repository where the github event occured.',
        },
        {
          key: 'number',
          type: 'string',
          displayName: 'Pull Request Number',
          description: 'The number of the pull request.',
        },
        {
          key: 'title',
          type: 'string',
          displayName: 'Pull Request Title',
          description: 'The title of the pull request.',
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Pull Request Body',
          description: 'The body content of the pull request.',
        },
      ],
      fields: [
        {
          key: 'org',
          type: 'string',
          displayName: 'Organization Name',
          description:
            'The organization name (must be a public organization or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'orgPRUpdated',
      name: 'Pull Request Updated Organization',
      description:
        'Trigger when a pull request is updated (not opened or closed) by someone in the specified organization.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The name of the repository where the github event occured.',
        },
        {
          key: 'number',
          type: 'string',
          displayName: 'Pull Request Number',
          description: 'The number of the pull request.',
        },
        {
          key: 'title',
          type: 'string',
          displayName: 'Pull Request Title',
          description: 'The title of the pull request.',
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Pull Request Body',
          description: 'The body content of the pull request.',
        },
        {
          key: 'event',
          type: 'string',
          displayName: 'Formatted Event',
          description:
            'A well formatted text description of the github event that occured.',
        },
      ],
      fields: [
        {
          key: 'org',
          type: 'string',
          displayName: 'Organization Name',
          description:
            'The organization name (must be a public organization or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'orgIssueOpened',
      name: 'Issue Created Organization',
      description:
        'Trigger when an issue is opened or reopened by someone in the specified organization.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The name of the repository where the github event occured.',
        },
        {
          key: 'title',
          type: 'string',
          displayName: 'Issue Title',
          description: 'The title of the Issue.',
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Issue Body',
          description: 'The body content of the Issue.',
        },
      ],
      fields: [
        {
          key: 'org',
          type: 'string',
          displayName: 'Organization Name',
          description:
            'The organization name (must be a public organization or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'orgIssueClosed',
      name: 'Issue Closed Organization',
      description:
        'Trigger when a issue is closed by someone in the specified organization.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The name of the repository where the github event occured.',
        },
        {
          key: 'title',
          type: 'string',
          displayName: 'Issue Title',
          description: 'The title of the Issue.',
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Issue Body',
          description: 'The body content of the issue.',
        },
      ],
      fields: [
        {
          key: 'org',
          type: 'string',
          displayName: 'Organization Name',
          description:
            'The organization name (must be a public organization or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'orgIssueUpdated',
      name: 'Issue Updated Organization',
      description:
        'Trigger when a issue is updated (not opened or closed) by someone in the specified organization.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The name of the repository where the github event occured.',
        },
        {
          key: 'title',
          type: 'string',
          displayName: 'Issue Title',
          description: 'The title of the Issue.',
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Issue Body',
          description: 'The body content of the Issue.',
        },
        {
          key: 'event',
          type: 'string',
          displayName: 'Formatted Event',
          description:
            'A well formatted text description of the github event that occured.',
        },
      ],
      fields: [
        {
          key: 'org',
          type: 'string',
          displayName: 'Organization Name',
          description:
            'The organization name (must be a public organization or you must be the owner of it).',
          required: true,
        },
      ],
    },

    // Repository events
    {
      id: 'repoPush',
      name: 'Repository Push',
      description:
        'Trigger when a git push event occurs on the specified repository.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'commits',
          type: 'string',
          displayName: 'Commit Messages',
          description: 'A well formated list of the commit messages pushed.',
        },
      ],
      fields: [
        {
          key: 'owner',
          type: 'string',
          displayName: 'Repository Owner',
          description: 'The owner of the repository to watch.',
          required: true,
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The repository name (must be a public repository or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'repoStarCreated',
      name: 'Starred Repository',
      description: 'Trigger when a repository has been starred by someone.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
      ],
      fields: [
        {
          key: 'owner',
          type: 'string',
          displayName: 'Repository Owner',
          description: 'The owner of the repository to watch.',
          required: true,
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The repository name (must be a public repository or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'repoStarDeleted',
      name: 'Un-Starred Repository',
      description: 'Trigger when a repository has been un-starred by someone.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
      ],
      fields: [
        {
          key: 'owner',
          type: 'string',
          displayName: 'Repository Owner',
          description: 'The owner of the repository to watch.',
          required: true,
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The repository name (must be a public repository or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'repoPROpened',
      name: 'Pull Request Created Repository',
      description:
        'Trigger when a pull request is openened or reopened by someone in the specified repository.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'number',
          type: 'string',
          displayName: 'Pull Request Number',
          description: 'The number of the pull request.',
        },
        {
          key: 'title',
          type: 'string',
          displayName: 'Pull Request Title',
          description: 'The title of the pull request.',
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Pull Request Body',
          description: 'The body content of the pull request.',
        },
      ],
      fields: [
        {
          key: 'owner',
          type: 'string',
          displayName: 'Repository Owner',
          description: 'The owner of the repository to watch.',
          required: true,
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The repository name (must be a public repository or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'repoPRClosed',
      name: 'Pull Request Closed Repository',
      description:
        'Trigger when a pull request is closed by someone in the specified repository.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'number',
          type: 'string',
          displayName: 'Pull Request Number',
          description: 'The number of the pull request.',
        },
        {
          key: 'title',
          type: 'string',
          displayName: 'Pull Request Title',
          description: 'The title of the pull request.',
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Pull Request Body',
          description: 'The body content of the pull request.',
        },
      ],
      fields: [
        {
          key: 'owner',
          type: 'string',
          displayName: 'Repository Owner',
          description: 'The owner of the repository to watch.',
          required: true,
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The repository name (must be a public repository or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'repoPRUpdated',
      name: 'Pull Request Updated Repository',
      description:
        'Trigger when a pull request is updated (not opened or closed) by someone in the specified repository.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'number',
          type: 'string',
          displayName: 'Pull Request Number',
          description: 'The number of the pull request.',
        },
        {
          key: 'title',
          type: 'string',
          displayName: 'Pull Request Title',
          description: 'The title of the pull request.',
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Pull Request Body',
          description: 'The body content of the pull request.',
        },
        {
          key: 'event',
          type: 'string',
          displayName: 'Formatted Event',
          description:
            'A well formatted text description of the github event that occured.',
        },
      ],
      fields: [
        {
          key: 'owner',
          type: 'string',
          displayName: 'Repository Owner',
          description: 'The owner of the repository to watch.',
          required: true,
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The repository name (must be a public repository or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'repoIssueOpened',
      name: 'Issue Created Repository',
      description:
        'Trigger when an issue is opened or reopened by someone in the specified repository.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'title',
          type: 'string',
          displayName: 'Issue Title',
          description: 'The title of the Issue.',
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Issue Body',
          description: 'The body content of the Issue.',
        },
      ],
      fields: [
        {
          key: 'owner',
          type: 'string',
          displayName: 'Repository Owner',
          description: 'The owner of the repository to watch.',
          required: true,
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The repository name (must be a public repository or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'repoIssueClosed',
      name: 'Issue Closed Repository',
      description:
        'Trigger when a issue is closed by someone in the specified repository.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'title',
          type: 'string',
          displayName: 'Issue Title',
          description: 'The title of the Issue.',
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Issue Body',
          description: 'The body content of the issue.',
        },
      ],
      fields: [
        {
          key: 'owner',
          type: 'string',
          displayName: 'Repository Owner',
          description: 'The owner of the repository to watch.',
          required: true,
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The repository name (must be a public repository or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'repoIssueUpdated',
      name: 'Issue Updated Repository',
      description:
        'Trigger when a issue is updated (not opened or closed) by someone in the specified repository.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'title',
          type: 'string',
          displayName: 'Issue Title',
          description: 'The title of the Issue.',
        },
        {
          key: 'body',
          type: 'string',
          displayName: 'Issue Body',
          description: 'The body content of the Issue.',
        },
        {
          key: 'event',
          type: 'string',
          displayName: 'Formatted Event',
          description:
            'A well formatted text description of the github event that occured.',
        },
      ],
      fields: [
        {
          key: 'owner',
          type: 'string',
          displayName: 'Repository Owner',
          description: 'The owner of the repository to watch.',
          required: true,
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The repository name (must be a public repository or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'repoAll',
      name: 'Repository Events',
      description:
        'Trigger when any git event occurs on the specified repository.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'event',
          type: 'string',
          displayName: 'Formatted Event',
          description:
            'A well formatted text description of the github event that occured.',
        },
      ],
      fields: [
        {
          key: 'owner',
          type: 'string',
          displayName: 'Repository Owner',
          description: 'The owner of the repository to watch.',
          required: true,
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The repository name (must be a public repository or you must be the owner of it).',
          required: true,
        },
      ],
    },
    {
      id: 'repoCustom',
      name: 'Repository Custom Events',
      description:
        'Trigger when the specified git events occurs on the specified repository.',
      variables: [
        {
          key: 'sender',
          type: 'string',
          displayName: 'Sender Username',
          description: 'The username of the sender of the github event.',
        },
        {
          key: 'sender_mail',
          type: 'string',
          displayName: 'Sender Email',
          description: 'The email address of the sender of the github event.',
        },
        {
          key: 'url',
          type: 'string',
          displayName: 'Repository url',
          description:
            'The web url link to the repository where the github event occured.',
        },
        {
          key: 'event',
          type: 'string',
          displayName: 'Formatted Event',
          description:
            'A well formatted text description of the github event that occured.',
        },
      ],
      fields: [
        {
          key: 'owner',
          type: 'string',
          displayName: 'Repository Owner',
          description: 'The owner of the repository to watch.',
          required: true,
        },
        {
          key: 'repo',
          type: 'string',
          displayName: 'Repository Name',
          description:
            'The repository name (must be a public repository or you must be the owner of it).',
          required: true,
        },
        {
          key: 'events',
          type: 'string',
          displayName: 'Events',
          description:
            'The github events to watch on the repository separated by a comma (refer to the github documentation for event labels).',
          required: true,
        },
      ],
    },
  ],
  actions: [],
};
