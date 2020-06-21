const tzip12NFT = artifacts.require("tzip-12-nft-big-map");
const { alice, bob } = require("./../scripts/sandbox/accounts");
const { MichelsonMap } = require("@taquito/taquito");
const { Tezos } = require("@taquito/taquito");

module.exports = async (deployer, network, accounts) => {
  let packed = [
    "QmcjPo1qwQqAyDz1AuvAnShvHZx8RFeMQvTxvGroz4Vfib",
    "QmTgwCf1vvR9SFmGZ4GARuY2cN5BgU7NLsigp3gyssh91u",
  ].map((CID) =>
    Tezos.rpc.packData({
      data: { string: CID },
      type: { prim: "string" },
    })
  );

  packed = await Promise.all(packed);

  console.log(packed);

  const initial_storage = {
    tokenOwners: MichelsonMap.fromLiteral({ 0: alice.pkh, 1: bob.pkh }),
    tokenMeta: MichelsonMap.fromLiteral({
      0: packed[0].packed,
      1: packed[1].packed,
    }),
  };

  await deployer.deploy(tzip12NFT, initial_storage);
};

