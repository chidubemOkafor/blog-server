const express = require("express");
const router = express.Router();
const PostControler = require("../../controllers/PostController");

router.post("/createPost", PostControler.CreatePost);

module.exports = router;
