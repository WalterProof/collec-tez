const functions = require("firebase-functions");
const users = require("./users");

exports.users = functions.https.onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "*");

  if (request.method !== "POST") {
    return response.end();
  }

  const { body } = request;
  const { keyHash } = body;
  user = await users.findOrCreate(keyHash);
  response.send(200, JSON.stringify(user));
});
