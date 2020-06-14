const nft = artifacts.require("nft");
const { alice } = require("./../scripts/sandbox/accounts");
const { MichelsonMap } = require("@taquito/taquito");

const initial_storage = {
  tokenOwners: MichelsonMap.fromLiteral({ 0: alice.pkh }),
  tokenMeta: MichelsonMap.fromLiteral({
    0: "QmNgnf4AkSTMpaPNGiaciMbon1hmqoBwsL2agGj1EyHnQK",
  }),
};

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(nft, initial_storage);
};

module.exports.initial_storage = initial_storage;
