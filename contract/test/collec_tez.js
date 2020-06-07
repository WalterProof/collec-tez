const collec_tez = artifacts.require("collec_tez");

const { initial_storage } = require("../migrations/1_deploy_collec_tez.js");
const constants = require("./../helpers/constants.js");
/**
 * For testing on carthagenet (testnet), instead of the sandbox network,
 * make sure to replace the keys for alice/bob accordingly.
 */
const { alice, bob } = require("./../scripts/sandbox/accounts");

contract("collec_tez", (accounts) => {
  let storage;
  let collec_tez_instance;

  before(async () => {
    collec_tez_instance = await collec_tez.deployed();
    /**
     * Display the current contract address for debugging purposes
     */
    console.log("Contract deployed at:", collec_tez_instance.address);
    storage = await collec_tez_instance.storage();
  });

  const expectedBalanceAlice = initial_storage.get(alice.pkh);
  it(`store a balance of ${expectedBalanceAlice} for Alice`, async () => {
    /**
     * Get balance for Alice from the smart contract's storage (by a big map key)
     */
    const deployedBalanceAlice = await storage.get(alice.pkh);
    assert.equal(expectedBalanceAlice, deployedBalanceAlice);
  });

  it(`not store any balance for Bob`, async () => {
    /**
     * If a big map key does not exist in the storage, the RPC (as of carthage) returns undefined
     */
    const deployedBalanceBob = await storage.get(bob.pkh);
    assert.equal(deployedBalanceBob, undefined);
  });

  it("transfer 1 token from Alice to Bob", async () => {
    const transferParam = [
      {
        /**
         * token_id: 0 represents the single token_id within our contract
         */
        token_id: 0,
        amount: 1,
        from_: alice.pkh,
        to_: bob.pkh,
      },
    ];

    /**
     * Call the `transfer` entrypoint
     */
    await collec_tez_instance.transfer(transferParam);
    /**
     * Bob's token balance should now be 1
     */
    const deployedBalanceBob = await storage.get(bob.pkh);
    const expectedBalanceBob = 1;
    assert.equal(deployedBalanceBob, expectedBalanceBob);
  });

  it(`not allow transfers from_ an address that did not sign the transaction`, async () => {
    const transferParam = [
      {
        token_id: 0,
        amount: 1,
        from_: bob.pkh,
        to_: alice.pkh,
      },
    ];

    try {
      /**
       * Transactions in the test suite are signed by a secret/private key
       * configured in truffle-config.js
       */
      await collec_tez_instance.transfer(transferParam);
    } catch (e) {
      assert.equal(
        e.message,
        constants.contractErrors.fromEqualToSenderAddress
      );
    }
  });

  it(`not transfer tokens from Alice to Bob when Alice's balance is insufficient`, async () => {
    const transferParam = [
      {
        token_id: 0,
        // Alice's balance at this point is 9
        amount: 100,
        from_: alice.pkh,
        to_: bob.pkh,
      },
    ];

    try {
      await collec_tez_instance.transfer(transferParam);
    } catch (e) {
      assert.equal(e.message, constants.contractErrors.insufficientBalance);
    }
  });
});
