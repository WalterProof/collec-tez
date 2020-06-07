const collec_tez = artifacts.require("collec_tez");
const { alice } = require("./../scripts/sandbox/accounts");
const { MichelsonMap } = require("@taquito/taquito");

const token_balance = 10;
const initial_storage = MichelsonMap.fromLiteral({
  [`${alice.pkh}`]: token_balance,
});

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(collec_tez, initial_storage);
};

module.exports.initial_storage = initial_storage;
