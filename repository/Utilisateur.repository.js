const mongoose = require("mongoose");
const user = require("./../models/Utilisateur");
class UtilisateurRepository {
  constructor() {}

  sauvegarderUtilisateur(user) {
    user.save();
  }
  finByFacebookId(id) {
    return user.findById(id);
  }
  findOne(id) {
    let query = user.find({ _id: id });
    return query;
  }
  updateUtilisateur(id, update) {
    user
      .findByIdAndUpdate(id, update)
      .then(result => console.log("updating sucessfully"))
      .catch(err => console.log("updating error try this message", err));
  }
}

module.exports = UtilisateurRepository;
