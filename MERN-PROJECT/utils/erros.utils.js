module.exports.signUpErrors = (err) => {
  let errors = {
    nom: "",
    prenom: "",
    email: "",
    motdepasse: "",
  };

  if (err.message.includes("nom")) {
    errors.nom = "Nom invalide";
  }

  if (err.message.includes("prenom")) {
    errors.prenom = "Prénom invalide";
  }

  if (err.message.includes("email")) {
    errors.email = "Email invalide";
  }

  if (err.message.includes("motdepasse")) {
    errors.motdepasse = "Mot de passe invalide";
  }

  return errors;
};

module.exports.signInErrors = (err) => {
  let errors = {
    email: "",
    motdepasse: "",
  };

  if (err.message.includes("email")) {
    errors.email = "Email inconnu";
  }

  if (err.message.includes("motdepasse")) {
    errors.motdepasse = "Mot de passe incorrect";
  }

  return errors;
};


module.exports.uploadErrors = (err) => {
  let errors = {
    format: "",
    maxSize: "",
  };

  if (err.message.includes("invalid file")) {
    errors.format = "Format incompatible";
  }

  if (err.message.includes("max size")) {
    errors.maxSize = "Le fichier dépasse 500ko";
  }

  return errors;
};