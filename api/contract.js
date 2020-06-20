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
      const [idTokenMeta, idTokenOwners] = c.bigmap_ids;
      let owners = await contract.getIndexedBigMapValues(idTokenOwners);
      let meta = await contract.getIndexedBigMapValues(idTokenMeta);
      owners = owners.map((item) => ({
        id: item.key,
        owner: item.value,
      }));
      meta = meta.map((item) => ({
        id: item.key,
        hash: item.value,
      }));

      return meta.map((item, i) => ({
        ...owners[i],
        hash: item.hash,
      }));
    },
  };
})(config.CONTRACT_ADDRESS);

module.exports = contract;
