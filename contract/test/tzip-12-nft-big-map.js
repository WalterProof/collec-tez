const tzip12NFT = artifacts.require("tzip-12-nft-big-map");
const { initial_storage } = require("../migrations/1_deploy_nft.js");
const constants = require("./../helpers/constants.js");

const { alice, bob } = require("../scripts/sandbox/accounts");

contract("tzip-12-nft-big-map", (accounts) => {
  let storage;
  let tzip12Instance;

  before(async () => {
    tzip12Instance = await tzip12NFT.deployed();
    /**
     * Display the current contract address for debugging purposes
     */
    console.log("Contract deployed at:", tzip12Instance.address);
    storage = await tzip12Instance.storage();
  });

  describe("transfer", () => {
    it(`should fail if sender is not owner`, async () => {
      const tokenId = "1";
      const transferParam = [
        {
          from_: alice.pkh,
          txs: [
            {
              to_: bob.pkh,
              token_id: tokenId,
              amount: 1,
            },
          ],
        },
      ];

      try {
        await tzip12Instance.transfer(transferParam);
      } catch (e) {
        assert.equal(
          e.message,
          constants.contractErrors.errorInsufficientBalance
        );
      }
    });

    it(`should fail if token is undefined`, async () => {
      const tokenId = "2";
      const transferParam = [
        {
          from_: alice.pkh,
          txs: [
            {
              to_: bob.pkh,
              token_id: tokenId,
              amount: 1,
            },
          ],
        },
      ];

      try {
        await tzip12Instance.transfer(transferParam);
      } catch (e) {
        assert.equal(e.message, constants.contractErrors.errorTokenUndefined);
      }
    });

    it("should transfer 1 token from Alice to Bob", async () => {
      const tokenId = "0";
      const tokenOwnerBefore = await storage.tokenOwners.get(tokenId);

      const transferParam = [
        {
          from_: alice.pkh,
          txs: [
            {
              to_: bob.pkh,
              token_id: tokenId,
              amount: 1,
            },
          ],
        },
      ];
      await tzip12Instance.transfer(transferParam);

      const tokenOwnerAfter = await storage.tokenOwners.get(tokenId);
      assert.equal(tokenOwnerBefore, alice.pkh);
      assert.equal(tokenOwnerAfter, bob.pkh);
    });
  });
});
