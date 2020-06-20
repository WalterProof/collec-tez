const tzip12NFT = artifacts.require("tzip-12-nft-big-map");
const { alice, bob } = require("./../scripts/sandbox/accounts");
const { MichelsonMap } = require("@taquito/taquito");

const initial_storage = {
  tokenOwners: MichelsonMap.fromLiteral({ 0: alice.pkh, 1: bob.pkh }),
  tokenMeta: MichelsonMap.fromLiteral({
    0: "QmcjPo1qwQqAyDz1AuvAnShvHZx8RFeMQvTxvGroz4Vfib",
    1: "QmTgwCf1vvR9SFmGZ4GARuY2cN5BgU7NLsigp3gyssh91u",
  }),
};

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(tzip12NFT, initial_storage);
};

module.exports.initial_storage = initial_storage;
