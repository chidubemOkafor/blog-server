const express = require("express");
const {db} = require("./connect.js")
const cors = require("cors");
require('./connect.js')
const {User} = require('./schema/schema.js')

require("dotenv").config();

const PORT = process.env.PORT || 8090;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend url
    credentials: true,
  })
);

app.post("/api/signup", async (req, res) => {
  try {
    const {user_name, firebase_uid} = req.body
    const user = new User({user_name, firebase_uid})
    const newUser = await user.save()
    // get the user in 
    const userInfo = await User.findOne({_id: newUser._id})
    console.log(userInfo)
    res.status(200).json({message: "User Created", response: userInfo})
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "internal server error"})
  }                                                           
});

app.post("/api/login", async (req, res) => {
   const {data} = req.data
   if(data) {

   }
});


app.get("/api/getprofile/:id", (req, res) => {

});

app.post("/api/logout", (req, res) => {

});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}...`);
});
