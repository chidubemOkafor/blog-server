const { Post } = require("../schema");
const mongoose = require("mongoose");

class PostControler {
  static async CreatePost(req, res) {
    const { title, tag, content } = req.body;

    // the post body is going to contail a body of json containing the title, body and tags
    // first of all i need to check if there is a post of similer title

    // then if there is no post of similer title i need to add the post to the database
    // with the id of the poster,so that each post can be tied to person
    // once the post has been posted successfully i need to return success to the frontend
    console.log(req.body);
  }
}

module.exports = PostControler;
