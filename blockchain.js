const Block = require("./block");
const cryptoHash = require("./crypto-hash");
// const genesisBlock = require('')

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });

    this.chain.push(newBlock);
  }

  // isValidChain() receives a chain array and returns a boolean
  // indicating if the chain is valid or not
  static isValidChain(chain) {
    const len = chain.length;
    let lastBlock = Block.genesis();
    for (var i = 0; i < len; i++) {
      if (i == 0) {
        // genesis block
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
          return false;
        }
      } else {
        // check for fields for each block
        const { timestamp, lastHash, hash, data } = chain[i];
        const validHash = cryptoHash(timestamp, lastHash, data);
        if (lastHash !== lastBlock.hash || validHash !== hash) {
          return false;
        }
      }
      lastBlock = chain[i];
    }
    return true;
  }

  // replaceChain() takes in a chain parameter and replace it to the
  // new chain if the new chain is valid and longer than the original chains
  replaceChain(chain) {
    var condition1 = Blockchain.isValidChain(chain);
    var condition2 = this.chain.length < chain.length;
    if (condition1 && condition2) {
      this.chain = chain;
      console.log("Replacing chain with", chain);
    }
    if (!condition2) {
      console.error("The incoming chain must be longer");
      return;
    }
    if (!condition1) {
      console.error("The incoming chain must be valid");
      return;
    }
  }
}

module.exports = Blockchain;
