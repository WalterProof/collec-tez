const functions = require("firebase-functions");

const config = {
  FA2_ADDRESS: functions.config().fa2.address,
  NODE_URL: functions.config().node.url,
  TZSTATS_API: functions.config().tzstats.api,
  IPFS_GATEWAY: functions.config().ipfs.gateway,
};

module.exports = config;
