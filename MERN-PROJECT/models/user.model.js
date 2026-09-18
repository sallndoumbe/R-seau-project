const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Email invalide",
    },
  },
  motdepasse: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);