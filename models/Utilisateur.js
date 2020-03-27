let mongoose = require("mongoose");

let Blocks = new mongoose.Schema({ _id: Number }, { strict: false });

module.exports = mongoose.model("Utilisateur", Blocks);
