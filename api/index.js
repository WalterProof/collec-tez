const functions = require("firebase-functions");
const users = require("./users");

exports.users = functions.https.onRequest(async (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "*");

  if (request.method == "OPTIONS") {
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

  response.status(200).send(JSON.stringify(user));
});
