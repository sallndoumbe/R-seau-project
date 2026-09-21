const userModel = require("../models/user.model");
const objectId = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await userModel.find().select("-motdepasse");
  res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
  console.log(req.params);

  if (!objectId.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }

  try {
    const user = await userModel
      .findById(req.params.id)
      .select("-motdepasse");

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur du serveur");
  }
};

module.exports.updateUser = async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur du serveur");
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }

  try {
    await userModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Utilisateur supprimé avec succès",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur du serveur");
  }
};

module.exports.follow = async (req, res) => {
  if (!objectId.isValid(req.params.id) || !objectId.isValid(req.body.idToFollow)) {
    return res.status(400).send("ID inconnu");
  }

  try {
    // Ajouter l'utilisateur à la liste des abonnés de l'utilisateur cible
    await userModel.findByIdAndUpdate(req.params.id, {
      $addToSet: { following: req.body.idToFollow },
    });

    // Ajouter l'utilisateur cible à la liste des abonnés de l'utilisateur
    await userModel.findByIdAndUpdate(req.body.idToFollow, {
      $addToSet: { followers: req.params.id },
    });

    res.status(200).json({ message: "Abonnement réussi" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur du serveur");
  }
};

module.exports.unfollow = async (req, res) => {
  if (!objectId.isValid(req.params.id) || !objectId.isValid(req.body.idToUnfollow)) {
    return res.status(400).send("ID inconnu");
  }

  try {
    // Retirer l'utilisateur de la liste des abonnés de l'utilisateur cible
    await userModel.findByIdAndUpdate(req.params.id, {
      $pull: { following: req.body.idToUnfollow },
    });

    // Retirer l'utilisateur cible de la liste des abonnés de l'utilisateur
    await userModel.findByIdAndUpdate(req.body.idToUnfollow, {
      $pull: { followers: req.params.id },
    });

    res.status(200).json({ message: "Désabonnement réussi" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur du serveur");
  }
};