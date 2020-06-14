const nft = artifacts.require("nft");
const { alice, bob } = require("./../scripts/sandbox/accounts");
const { MichelsonMap } = require("@taquito/taquito");

const initial_storage = {
  tokenOwners: MichelsonMap.fromLiteral({ 0: alice.pkh, 1: bob.pkh }),
  tokenMeta: MichelsonMap.fromLiteral({
    0: "QmNgnf4AkSTMpaPNGiaciMbon1hmqoBwsL2agGj1EyHnQK",
    1: "QmPTJiftQAsThU78iHyUx3EFKtAR7Eq6PUQVk7T85p498Q",
  }),
};

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(nft, initial_storage);
};

module.exports.initial_storage = initial_storage;
