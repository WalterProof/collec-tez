const functions = require("firebase-functions");

const config = {
  CONTRACT_ADDRESS: functions.config().contract.address,
  NODE_URL: functions.config().node.url,
  TZSTATS_API: functions.config().tzstats.api,
  IPFS_GATEWAY: functions.config().ipfs.gateway,
};

module.exports = config;
