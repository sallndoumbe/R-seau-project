const Usemodele = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};


module.exports.signUp = async (req, res) => {
  const { nom, prenom, email, motdepasse } = req.body;

  try {
    const use = await Usemodele.create({
      nom,
      prenom,
      email,
      motdepasse,
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      use,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la création de l'utilisateur :",
      error
    );

    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
    });
  }
};

module.exports.signIn = async (req, res) => {
  const { email, motdepasse } = req.body;

  try {
    const use = await Usemodele.findOne({ email });

    if (!use) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      motdepasse,
      use.motdepasse
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    const token = createToken(use._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "Connexion réussie",
      use,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la connexion de l'utilisateur :",
      error
    );

    res.status(500).json({
      message: "Erreur lors de la connexion de l'utilisateur",
    });
  }
};


module.exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({
    message: "Déconnexion réussie",
  });
};  