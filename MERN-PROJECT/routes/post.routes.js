const router = require("express").Router();

const postController = require("../controllers/post.controllers");

router.post("/", postController.createPost);

router.get("/", postController.getAllPosts);

router.get("/:id", postController.getPostById);

router.put("/:id", postController.updatePost);

router.delete("/:id", postController.deletePost);
router.patch("/like-post/:id", postController.likePost);
router.patch("/unlike-post/:id", postController.unlikePost);

// Commenter un post
router.patch("/comment-post/:id", postController.commentPost);
router.patch("/edit-comment-post/:id", postController.editCommentPost);
router.delete("/delete-comment-post/:id", postController.deleteCommentPost);

module.exports = router;