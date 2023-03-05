config = {
  'name': 'docker-hub',
  'authType': 'clientSecret',
  'icon': '/images/docker_hub_icon.png',
  'color': '#080808',
  'events': [{
    'id': 'repositoryUpdate',
    'name': 'Repository update',
    'description': 'Triggered when a repository a new image is pushed to the repository',
    'fields': [
      {
        'key': 'repository',
        'type': 'string',
        'displayName': 'Repository',
        'description': 'The repository to listen for updates on',
        'required': True,
      }
    ],
    'variables': []
  }],
  'actions': [],
}