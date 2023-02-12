export default {
  name: 'starton',
  authType: 'apiKey',
  icon: '/images/starton_icon.png',
  color: '#01E6CD',
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
    {
      id: 'addressSentNativeCurrency',
      name: 'Address Sent Native Currency',
      description: 'Trigger when an address send some native tokens',
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
    {
      id: 'addressActivity',
      name: 'Address Activity',
      description: 'Trigger when an address receive or send some native tokens',
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
    {
      id: 'eventApproval',
      name: 'Event Approval',
      description: 'Trigger when an address approve a spending of a token',
      variables: [
        {
          key: 'owner',
          type: 'string',
          displayName: 'Owner',
          description: 'The address that owns the tokens',
        },
        {
          key: 'spender',
          type: 'string',
          displayName: 'Spender',
          description: 'The address that can spend the tokens',
        },
        {
          key: 'value',
          type: 'string',
          displayName: 'Value',
          description: 'The value of the transaction',
        },
        {
          key: 'contract',
          type: 'string',
          displayName: 'Contract Address',
          description: 'The address of the contract',
        },
      ],
      fields: [
        {
          key: 'address',
          type: 'string',
          displayName: 'Contract Address',
          description: 'The contract to watch',
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
    {
      id: 'eventMint',
      name: 'Event Mint',
      description: 'Trigger when a token is minted',
      variables: [
        {
          key: 'to',
          type: 'string',
          displayName: 'To',
          description: 'The address that received the token',
        },
        {
          key: 'value',
          type: 'string',
          displayName: 'Value',
          description: 'The value of the transaction',
        },
        {
          key: 'contract',
          type: 'string',
          displayName: 'Contract Address',
          description: 'The address of the contract',
        },
      ],
      fields: [
        {
          key: 'address',
          type: 'string',
          displayName: 'Contract Address',
          description: 'The contract to watch',
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
    {
      id: 'eventTransfer',
      name: 'Event Transfer',
      description: 'Trigger when a transfer is made',
      variables: [
        {
          key: 'from',
          type: 'string',
          displayName: 'From',
          description: 'The address that sent the token',
        },
        {
          key: 'to',
          type: 'string',
          displayName: 'To',
          description: 'The address that received the token',
        },
        {
          key: 'value',
          type: 'string',
          displayName: 'Value',
          description: 'The amount of tokens sent',
        },
        {
          key: 'contract',
          type: 'string',
          displayName: 'Contract Address',
          description: 'The address of the contract',
        },
      ],
      fields: [
        {
          key: 'address',
          type: 'string',
          displayName: 'Contract Address',
          description: 'The contract to watch',
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
    {
      id: 'erc721EventTransfer',
      name: 'ERC721 Event Transfer',
      description: 'Trigger when a ERC721 transfer is made',
      variables: [
        {
          key: 'from',
          type: 'string',
          displayName: 'From',
          description: 'The address that sent the token',
        },
        {
          key: 'to',
          type: 'string',
          displayName: 'To',
          description: 'The address that received the token',
        },
        {
          key: 'tokenId',
          type: 'string',
          displayName: 'Token ID',
          description: 'The id of the token',
        },
        {
          key: 'contract',
          type: 'string',
          displayName: 'Contract Address',
          description: 'The address of the contract',
        },
      ],
      fields: [
        {
          key: 'address',
          type: 'string',
          displayName: 'Contract Address',
          description: 'The contract to watch',
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
    {
      id: 'erc1155EventTransferSingle',
      name: 'ERC1155 Event Transfer Single',
      description: 'Trigger when a single ERC1155 token is being transfered',
      variables: [
        {
          key: 'from',
          type: 'string',
          displayName: 'From',
          description: 'The address that sent the token',
        },
        {
          key: 'to',
          type: 'string',
          displayName: 'To',
          description: 'The address that received the token',
        },
        {
          key: 'operator',
          type: 'string',
          displayName: 'Operator',
          description: 'The address that sent the transaction',
        },
        {
          key: 'tokenId',
          type: 'string',
          displayName: 'Token ID',
          description: 'The id of the token',
        },
        {
          key: 'value',
          type: 'string',
          displayName: 'Value',
          description: 'The amount of tokens sent',
        },
        {
          key: 'contract',
          type: 'string',
          displayName: 'Contract Address',
          description: 'The address of the contract',
        },
      ],
      fields: [
        {
          key: 'address',
          type: 'string',
          displayName: 'Contract Address',
          description: 'The contract to watch',
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
    // {
    //   id: 'erc1155eventTransferBatch',
    //   name: 'ERC1155 Event Transfer Batch',
    //   description: 'Trigger when a batch of ERC1155 tokens are being transfered',
    //   variables: [
    //     {
    //       key: 'from',
    //       type: 'string',
    //       displayName: 'From',
    //       description: 'The address that sent the tokens',
    //     },
    //     {
    //       key: 'to',
    //       type: 'string',
    //       displayName: 'To',
    //       description: 'The address that received the tokens',
    //     },
    //     {
    //       key: 'operator',
    //       type: 'string',
    //       displayName: 'Operator',
    //       description: 'The address that sent the transaction',
    //     },
    //     {
    //       key: 'tokenIds',
    //       type: 'string[]',
    //       displayName: 'Token IDs',
    //       description: 'The id of the tokens',
    //     },
    //     {
    //       key: 'values',
    //       type: 'string[]',
    //       displayName: 'Values',
    //       description: 'The amount of tokens sent',
    //     },
    //     {
    //       key: 'contract',
    //       type: 'string',
    //       displayName: 'Contract Address',
    //       description: 'The address of the contract',
    //     },
    //   ],
    //   fields: [
    //     {
    //       key: 'contract',
    //       type: 'string',
    //       displayName: 'Contract Address',
    //       description: 'The contract to watch',
    //       required: true,
    //     },
    //   ],
    // },
  ],
  actions: [
    // {
    //   id: 'deploySmartContractFromTemplate',
    //   name: 'Deploy Smart Contract From Template',
    //   description: 'Deploy a smart contract from a template',
    //   variables: [
    //     {
    //       key: 'contract',
    //       type: 'string',
    //       displayName: 'Contract Address',
    //       description: 'The newly created contract address',
    //     },
    //   ],
    //   fields: [
    //     {
    //       key: 'templateId',
    //       type: 'string',
    //       displayName: 'Template ID',
    //       description: 'the template to deploy',
    //       required: true,
    //     },
    //     {
    //       key: 'network',
    //       type: 'string',
    //       displayName: 'Network',
    //       description: 'The network to watch',
    //       required: true,
    //     },
    //     {
    //       key: 'params',
    //       type: 'string[]',
    //       displayName: 'Params',
    //       description:
    //         'The params to deploy the contract with. The order of the params must match the order of the params in the template',
    //       required: true,
    //     },
    //   ],
    // },
    // {
    //   id: 'deploySmartContractFromBytecode',
    //   name: 'Deploy Smart Contract From Bytecode',
    //   description: 'Deploy a smart contract from a bytecode',
    //   variables: [
    //     {
    //       key: 'contract',
    //       type: 'string',
    //       displayName: 'Contract Address',
    //       description: 'The newly created contract address',
    //     },
    //   ],
    //   fields: [
    //     {
    //       key: 'templateId',
    //       type: 'string',
    //       displayName: 'Template ID',
    //       description: 'the template to deploy',
    //       required: true,
    //     },
    //     {
    //       key: 'network',
    //       type: 'string',
    //       displayName: 'Network',
    //       description: 'The network to watch',
    //       required: true,
    //     },
    //     {
    //       key: 'params',
    //       type: 'string[]',
    //       displayName: 'Params',
    //       description:
    //         'The params to deploy the contract with. The order of the params must match the order of the params in the template',
    //       required: true,
    //     },
    //   ],
    // },
  ],
};
