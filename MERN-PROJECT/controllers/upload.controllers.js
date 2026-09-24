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

    // Vérifier le type du fichier
    if (
      req.file.mimetype !== "image/jpeg" &&
      req.file.mimetype !== "image/png"
    ) {
      return res.status(400).json({
        message: "Le fichier doit être une image JPEG ou PNG",
      });
    }

    // Vérifier la taille
    if (req.file.size > 500000) {
      return res.status(400).json({
        message: "Le fichier est trop volumineux",
      });
    }

    // Récupérer l'extension du fichier original
   const extension = path.extname(req.file.originalname);

const fileName = Date.now() + extension;

console.log("EXTENSION :", extension);
console.log("FILENAME :", fileName);

const uploadDir = path.join(
  __dirname,
  "../client/public/uploads/profil"
);

fs.mkdirSync(uploadDir, { recursive: true });

const filePath = path.join(uploadDir, fileName);

fs.writeFileSync(filePath, req.file.buffer);
    // Mettre à jour l'utilisateur dans MongoDB
    const updatedUser = await userModel.findByIdAndUpdate(
      req.body.userId,
      {
        $set: {
          photo: "./uploads/profil/" + fileName,
        },
      },
      {
        returnDocument: "after",
      }
    );

    console.log("UTILISATEUR MIS À JOUR :", updatedUser);

    return res.status(200).json({
      message: "Photo de profil uploadée avec succès",
      photo: "./uploads/profil/" + fileName,
    });

  } catch (error) {
    console.error("Erreur upload :", error);

    return res.status(500).json({
      message: "Erreur lors de l'upload",
      error: error.message,
    });
  }
};