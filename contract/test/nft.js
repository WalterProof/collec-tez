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
    const deployedNonExistingTokenOwner = await storage.tokenOwners.get(`2`);
    assert.equal(deployedNonExistingTokenOwner, undefined);
    const deployedNonExistingTokenMeta = await storage.tokenMeta.get(`2`);
    assert.equal(deployedNonExistingTokenMeta, undefined);
  });

  it(`fails if sender is not owner`, async () => {
    const transferParam = [alice.pkh, 1];

    try {
      await nftInstance.transfer(...transferParam);
    } catch (e) {
      assert.equal(
        e.message,
        constants.contractErrors.ownerEqualToSenderAddress
      );
    }
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

  it(`fail if invalid token id`, async () => {
    const transferParam = [bob.pkh, 2];

    try {
      await nftInstance.transfer(...transferParam);
    } catch (e) {
      assert.equal(e.message, constants.contractErrors.invalidTokenId);
    }
  });
});
