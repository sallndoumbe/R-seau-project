const Postmodel = require("../models/post.model");
const UserModel = require("../models/user.model");
const objectId = require("mongoose").Types.ObjectId;



// Créer un nouveau post
module.exports.createPost = async (req, res) => {
  try {
    
    const newPost = new Postmodel({
      userId: req.body.userId,
      message: req.body.message,
      picture: req.body.picture || "",
      video: req.body.video || "",
      likers: [],
      comments: [],
    });

    console.log("POST AVANT SAVE :", newPost);

    const post = await newPost.save();

    console.log("POST CRÉÉ :", post);

    return res.status(201).json(post);

  } catch (error) {
    console.error("ERREUR CREATE POST :", error);

    return res.status(400).json({
      message: "Erreur lors de la création du post",
      error: error.message,
    });
  }
};;

// Récupérer tous les posts
module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Postmodel.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des posts", error });
  }
};


// Récupérer un post par ID
module.exports.getPostById = async (req, res) => {
  try {
    const post = await Postmodel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du post", error });
  }
};

// Mettre à jour un post
module.exports.updatePost = async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID de post invalide" });
    const updatedRecord = {
        message: req.body.message,
        picture: req.body.picture,
        video: req.body.video,
      };
      Postmodel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
          if (!err) res.send(docs);
          else console.log("Erreur lors de la mise à jour du post : " + err);
        }
      );

    }
  }

// Supprimer un post

module.exports.deletePost = async (req, res) => {
    if (!objectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID de post invalide" });
  }
  Postmodel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Erreur lors de la suppression du post : " + err);
  });
};

module.exports.likePost = async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "ID de post invalide",
    });
  }

  if (!objectId.isValid(req.body.userId)) {
    return res.status(400).json({
      message: "ID utilisateur invalide",
    });
  }

  try {
    // Ajouter le user dans les likers du post
    await Postmodel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          likers: req.body.userId,
        },
      },
      { new: true }
    );

    // Ajouter le post dans les likes de l'utilisateur
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      {
        $addToSet: {
          likes: req.params.id,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Post liké avec succès",
    });
  } catch (error) {
    console.error("Erreur lors du like du post :", error);

    res.status(500).json({
      message: "Erreur lors du like du post",
      error: error.message,
    });
  }
};

module.exports.unlikePost = async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID de post invalide" });
  }
if (!objectId.isValid(req.body.userId)) {
    return res.status(400).json({
      message: "ID utilisateur invalide",
    });
  }

  try {
    // Ajouter le user dans les likers du post
    await Postmodel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          likers: req.body.userId,
        },
      },
      { new: true }
    );

    // Ajouter le post dans les likes de l'utilisateur
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      {
        $pull: {
          likes: req.params.id,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Post unliké avec succès",
    });
  } catch (error) {
    console.error("Erreur lors du like du post :", error);

    res.status(500).json({
      message: "Erreur lors du like du post",
      error: error.message,
    });
  }
};

module.exports.commentPost = async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID de post invalide" });
  }

  try {
    const post = await Postmodel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    const newComment = {
      commenterId: req.body.commenterId,
      commenterPseudo: req.body.commenterPseudo,
      text: req.body.text,
      timestamp: new Date().getTime(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du commentaire", error });
  }
};  

module.exports.editCommentPost = async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID de post invalide" });
  }

  try {
    const post = await Postmodel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    const comment = post.comments.id(req.body.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    comment.text = req.body.text;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Erreur lors de la modification du commentaire :", error);
    res.status(500).json({ message: "Erreur lors de la modification du commentaire", error });
  }
};

module.exports.deleteCommentPost = async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "ID de post invalide",
    });
  }

  try {
    const post = await Postmodel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post non trouvé",
      });
    }

    const comment = post.comments.id(req.body.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Commentaire non trouvé",
      });
    }

    comment.deleteOne();

    await post.save();

    return res.status(200).json({
      message: "Commentaire supprimé avec succès",
      post,
    });
  } catch (error) {
    console.error("ERREUR COMPLÈTE :", error);

    return res.status(500).json({
      message: "Erreur lors de la suppression du commentaire",
      error: error.message,
    });
  }
};