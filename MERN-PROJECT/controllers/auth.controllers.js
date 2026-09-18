const Usemodele = require("../models/user.model");

module.exports.signup = async (req, res) => {
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