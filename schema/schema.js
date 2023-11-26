const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    user_name: {type: String, required: true},
    firebase_uid: {type: String, required: true},
    bio: {type: String, required: false}
})

const postSchema = new Schema ({
    title: {type: String, required: true},
    body: {type: String, required: true},
    created_on: {type: Date, default: new Date, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
})

const User = model("User", userSchema)
const Post = model("Post", postSchema)
module.exports = {User, Post}