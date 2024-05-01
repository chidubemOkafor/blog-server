const express = require("express");
const cors = require("cors");
require("./connect.js");
require("./cloudinary-config.js");
require("dotenv").config();
const Authentication = require("./routes/authentication/authentication.js");
const Post = require("./routes/post/post.js");
const ImageUPload = require("./routes/ImageUPload/ImageUPload.js");

const PORT = process.env.PORT || 8090;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend url
    credentials: true,
  })
);

app.use("/api/v1", Authentication);
app.use("/api/v1", Post);
app.use("/api/v1", ImageUPload);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}...`);
});
