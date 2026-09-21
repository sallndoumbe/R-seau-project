const Usemodele = require("../models/user.model");
const jwt = require("jsonwebtoken");

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
      return res.status(404).json({
        message: "Utilisateur non trouvé",
      });
    }

    if (use.motdepasse !== motdepasse) {
      return res.status(401).json({
        message: "Mot de passe incorrect",
      });
    }

    const token = jwt.sign({ id: use._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Connexion réussie",
      token,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);

    res.status(500).json({
      message: "Erreur lors de la connexion",
    });
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Déconnexion réussie",
  });
};  