export const dappConfig = {
  CONTRACT_NAME: 'PSM',
  INSTANCE_PREFIX: ':published.psm.IST.',
  INSTANCES_KEY: ':published.agoricNames.instance',
};

export const networkConfigs = {
  mainnet: {
    label: 'Agoric Mainnet',
    url: 'https://main.agoric.net/network-config',
  },
  testnet: {
    label: 'Agoric Testnet',
    url: 'https://testnet.agoric.net/network-config',
  },
  devnet: {
    label: 'Agoric Devnet',
    url: 'https://devnet.agoric.net/network-config',
  },
  ollinet: {
    label: 'Agoric Ollinet',
    url: 'https://ollinet.agoric.net/network-config',
  },
  emerynet: {
    label: 'Agoric Emerynet',
    url: 'https://emerynet.agoric.net/network-config',
  },
  localhost: {
    label: 'Local Network',
    url: 'http://localhost:3000/wallet/network-config',
  },
};
