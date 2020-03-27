const mongoose = require("mongoose");
const user = require("./../models/Utilisateur");
class UtilisateurRepository {
  constructor() {}

  sauvegarderUtilisateur(user) {
    user.save();
  }
  finByFacebookId(id, cb) {
    return user.findById(id);
  }
  updateUtilisateur(id, update, cb) {
    user
      .findByIdAndUpdate(id, update, cb)
      .then(result => console.log("updating sucessfully"))
      .catch(err => console.log("updating error try this message", err));
  }
}

module.exports = UtilisateurRepository;
