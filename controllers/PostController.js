const { Post } = require("../schema/schema");

class PostControler {
  static async CreatePost(req, res) {
    const { title, tag, content } = req.body;
    const isExist = await Post.find({ title });

    if (isExist) {
      res.status(404).json({ message: "post already exists" });
      console.log("post already exists");
    } else {
      const createPost = new Post({
        title,
        tag,
        content,
      });
      const newPost = await createPost.save();
      return res.status(200).json({ message: "post created", data: newPost });
      console.log(newPost);
    }
  }
}

module.exports = PostControler;
