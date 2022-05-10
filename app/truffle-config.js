const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();


module.exports = {
  networks: {
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, 'wss://ropsten.infura.io/ws/v3/7bcf9e3b735344dd932e2fc3e464e56b'),
      network_id: 3,
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    }
  },
  compilers: {
    solc: {
      version: "^0.5.0"
    }
  }
};
