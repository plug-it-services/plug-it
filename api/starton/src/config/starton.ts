export default {
  name: 'starton',
  authType: 'apiKey',
  icon: '/images/starton_icon.png',
  events: [
    {
      id: 'addressReceivedNativeTokens',
      name: 'Address Received Native Tokens',
      description: 'Trigger when an address receive some native tokens',
      variables: [
        {
          key: 'from',
          type: 'string',
          displayName: 'From',
          description: 'The address that sent the transaction',
        },
        {
          key: 'to',
          type: 'string',
          displayName: 'To',
          description: 'The address that received the transaction',
        },
        {
          key: 'value',
          type: 'string',
          displayName: 'Value',
          description: 'The value of the transaction',
        },
      ],
      fields: [
        {
          key: 'address',
          type: 'string',
          displayName: 'Address',
          description: 'The address to watch',
          required: true,
        },
        {
          key: 'network',
          type: 'string',
          displayName: 'Network',
          description: 'The network to watch',
          required: true,
        },
        {
          key: 'confirmations',
          type: 'string',
          displayName: 'Confirmations',
          description:
            'The number of confirmations to wait for before emitting the event',
          required: true,
        },
      ],
    },
  ],
  actions: [],
};
