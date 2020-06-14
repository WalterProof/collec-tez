const nft = artifacts.require("nft");

const { initial_storage } = require("../migrations/1_deploy_nft.js");
const constants = require("./../helpers/constants.js");

/**
 * For testing on carthagenet (testnet), instead of the sandbox network,
 * make sure to replace the keys for alice/bob accordingly.
 */
const { alice, bob } = require("./../scripts/sandbox/accounts");

contract("nft", (accounts) => {
  let storage;
  let nftInstance;

  before(async () => {
    nftInstance = await nft.deployed();
    /**
     * Display the current contract address for debugging purposes
     */
    console.log("Contract deployed at:", nftInstance.address);
    storage = await nftInstance.storage();
  });

  const expectedAddress = initial_storage.tokenOwners.get("0");
  it(`store ${expectedAddress} as token owner`, async () => {
    const deployedTokenOwner = await storage.tokenOwners.get("0");
    assert.equal(expectedAddress, deployedTokenOwner);
  });

  const expectedIpfsPinHash = initial_storage.tokenMeta.get("0");
  it(`store ${expectedIpfsPinHash} as token ipfs pin hash`, async () => {
    const deployedTokenIpfsPinHash = await storage.tokenMeta.get("0");
    assert.equal(expectedIpfsPinHash, deployedTokenIpfsPinHash);
  });

  it(`non existing tokens are undefined`, async () => {
    const deployedNonExistingTokenOwner = await storage.tokenOwners.get(`1`);
    assert.equal(deployedNonExistingTokenOwner, undefined);
    const deployedNonExistingTokenMeta = await storage.tokenMeta.get(`1`);
    assert.equal(deployedNonExistingTokenMeta, undefined);
  });

  it("transfer a nft from Alice to Bob", async () => {
    const transferParam = [bob.pkh, 0];

    /**
     * Call the `transfer` entrypoint
     */
    await nftInstance.transfer(...transferParam);

    /**
     * Bob should now own the nft
     */
    const deployedTokenOwner = await storage.tokenOwners.get("0");
    assert.equal(deployedTokenOwner, bob.pkh);
  });

  // it(`not allow transfers from_ an address that did not sign the transaction`, async () => {
  //   const transferParam = [
  //     {
  //       token_id: 0,
  //       amount: 1,
  //       from_: bob.pkh,
  //       to_: alice.pkh,
  //     },
  //   ];

  //   try {
  //     /**
  //      * Transactions in the test suite are signed by a secret/private key
  //      * configured in truffle-config.js
  //      */
  //     await nft_instance.transfer(transferParam);
  //   } catch (e) {
  //     assert.equal(
  //       e.message,
  //       constants.contractErrors.fromEqualToSenderAddress
  //     );
  //   }
  // });

  // it(`not transfer tokens from Alice to Bob when Alice's balance is insufficient`, async () => {
  //   const transferParam = [
  //     {
  //       token_id: 0,
  //       // Alice's balance at this point is 9
  //       amount: 100,
  //       from_: alice.pkh,
  //       to_: bob.pkh,
  //     },
  //   ];

  //   try {
  //     await nft_instance.transfer(transferParam);
  //   } catch (e) {
  //     assert.equal(e.message, constants.contractErrors.insufficientBalance);
  //   }
  // });
});
