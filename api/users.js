const admin = require("./admin");

const db = admin.getFirestore();

const users = ((_db) => {
  return {
    async findByKeyHash(keyHash) {
      const userRef = _db.collection("users");
      const query = userRef.where("keyHash", "==", keyHash);

      const querySnapshot = await query.get();
      if (querySnapshot.empty) {
        return;
      }

      return querySnapshot.docs[0].data();
    },

    async findOrCreate(keyHash) {
      const user = await users.findByKeyHash(keyHash);

      if (!user) {
        await users.create(keyHash);
      }

      return users.findByKeyHash(keyHash);
    },

    async create(keyHash) {
      return _db.collection("users").doc(keyHash).set({
        keyHash,
      });
    },

    async update(updatedUser) {
      return _db.collection("users").doc(updatedUser.keyHash).set(updatedUser);
    },
  };
})(db);

module.exports = users;
