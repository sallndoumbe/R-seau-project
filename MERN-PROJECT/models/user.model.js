const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
  bio: {
    type: String,
    default: "",
  },
  photo: {
    type: String,
    default: "",
  },  
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
},

{
 timestamps: true,
}
);

//play function to hash password before saving user
userSchema.pre("save", async function () {
  if (!this.isModified("motdepasse")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.motdepasse = await bcrypt.hash(this.motdepasse, salt);
  } catch (error) {
    console.error("Erreur lors du hachage du mot de passe :", error);
    throw error;
  }
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel ;