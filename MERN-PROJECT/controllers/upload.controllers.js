const userModel = require("../models/user.model");
const fs = require("fs");
const path = require("path");

module.exports.uploadProfil = async (req, res) => {
  try {
    // Vérifier qu'un fichier a été envoyé
    if (!req.file) {
      return res.status(400).json({
        message: "Aucun fichier envoyé",
      });
    }

    // Vérifier le type de fichier
    if (
      req.file.mimetype !== "image/jpeg" &&
      req.file.mimetype !== "image/png"
    ) {
      return res.status(400).json({
        message: "Seuls les fichiers JPG et PNG sont autorisés",
      });
    }

    // Vérifier la taille : 500 Ko
    if (req.file.size > 500000) {
      return res.status(400).json({
        message: "Le fichier est trop volumineux",
      });
    }

    const fileName = req.body.name + ".jpg";

    // Chemin vers le dossier de destination
    const uploadPath = path.join(
      __dirname,
      "../client/public/uploads/profil",
      fileName
    );

    // Écrire le fichier sur le disque
    fs.writeFileSync(uploadPath, req.file.buffer);

    // Enregistrer le chemin dans MongoDB
    await userModel.findByIdAndUpdate(
      req.body.userId,
      {
        $set: {
          photo: "./uploads/profil/" + fileName,
        },
      }
    );

    return res.status(200).json({
      message: "File uploaded successfully",
    });

  } catch (error) {
    console.error("Erreur upload profil :", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};