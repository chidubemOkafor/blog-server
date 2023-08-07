const express = require("express");
const { connection } = require("./connect.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const PORT = process.env.PORT || 8090;
const app = express();

(() => {
  try {
    connection.connect();
    console.log("conected to mysql database");
  } catch (e) {
    console.error(`reverted with: ${e}`);
  }
})();

app.use(express.json());
app.use(cors());

app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res
      .status(400)
      .json({ message: "not complete", type: "error", status: "404" });
  }
  sql = "INSERT INTO createaccount(username,passwords,email) VALUES(?,?,?)";
  values = [name, email, password];

  connection.query(sql, values, (error, response) => {
    if (error) {
      console.error("reverted with: ", error);
      res.status(500).json({
        message: "internal server error",
        type: "sql error",
        status: "500",
      });
    } else {
      res.status(200).json({ message: "account created", status: "200" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}...`);
});
