const admin = require("firebase-admin");

const adm = (_admin) => {
  _admin.initializeApp();

  return {
    getFirestore() {
      return _admin.firestore();
    },
  };
};

module.exports = adm(admin);
