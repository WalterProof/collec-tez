const axios = require("axios");
const http = require("./http");
const config = require("./config");

const ipfs = {
  async getFile(hash) {
    return http.performGetRequest(config.IPFS_GATEWAY, hash);
  },
};

module.exports = ipfs;
