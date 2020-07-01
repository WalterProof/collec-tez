const config = require("./config");
const http = require("./http");

const contract = ((address) => {
  return {
    async getStorage() {
      return http.performGetRequest(
        config.NODE_URL,
        `chains/main/blocks/head/context/contracts/${address}/storage`
      );
    },

    async getIndexedContract() {
      return http.performGetRequest(
        config.TZSTATS_API,
        `explorer/contract/${address}`
      );
    },

    async getIndexedBigMapValues(id) {
      return http.performGetRequest(
        config.TZSTATS_API,
        `explorer/bigmap/${id}/values`
      );
    },

    async getTokens() {
      const c = await contract.getIndexedContract();
      const [
        bmIdTokenOperators,
        bmIdTokenMeta,
        bmIdTokensLedger,
      ] = c.bigmap_ids;
      let meta = await contract.getIndexedBigMapValues(bmIdTokenMeta);
      let owners = await contract.getIndexedBigMapValues(bmIdTokensLedger);
      owners = owners.map((item) => ({
        id: item.key,
        owner: item.value,
      }));

      meta = meta.map((item) => ({
        name: item.value.extras.name,
        cId: item.value.extras.c_id,
      }));

      return meta.map((item, i) => ({
        ...owners[i],
        ...item,
      }));
    },
  };
})(config.FA2_ADDRESS);

module.exports = contract;
