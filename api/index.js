const functions = require("firebase-functions");
const users = require("./users");
const contract = require("./contract");
const ipfs = require("./ipfs");

// POST: find or create given keyHash in database
// PUT: update account
exports.users = functions.https.onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "*");

  if (request.method !== "POST" && request.method !== "PUT") {
    return response.end();
  }

  const { body } = request;
  const { keyHash } = body;

  if (request.method === "POST") {
    user = await users.findOrCreate(keyHash);
  }

  if (request.method === "PUT") {
    user = await users.update(body);
  }

  return response.status(200).send(JSON.stringify(user));
});

// get the tokens from contract storage
exports.tokens = functions.https.onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "*");

  if (request.method !== "GET") {
    return response.end();
  }

  let tokens = await contract.getTokens();
  let meta = tokens.map((token) => ipfs.getFile(token.cId));
  meta = await Promise.all(meta);

  tokens = tokens.map((token, i) => ({ ...token, meta: meta[i] }));

  return response.status(200).send(JSON.stringify(tokens));
});
