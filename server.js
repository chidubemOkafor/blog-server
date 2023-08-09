const express = require("express");
const { connection } = require("./connect.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
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
app.use(cookieParser());

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res
      .status(400)
      .json({ message: "not complete", type: "error", status: 404 });
  }

  try {
    const encrypted_password = await bcrypt.hash(
      password,
      process.env.SALTROUNDS
    );

    const sql =
      "INSERT INTO createaccount(username,passwords,email) VALUES(?,?,?)";
    const values = [name, encrypted_password, email];

    connection.query(sql, values, (error, result) => {
      if (error) {
        console.error("reverted with: ", error);
        res.status(500).json({
          message: "internal server error",
          type: "sql error",
          status: "500",
        });
      } else {
        const token = jwt.sign(
          { name, email, encrypted_password },
          process.env.SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("token", token, {
          httpOnly: true,
        });
        res.status(200).json({ message: "account created", status: 200 });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "internal server error",
      type: "hashing error",
      status: 500,
    });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).json({
      message: "incomplete data",
      type: "error",
      status: 401,
    });
  }

  const sql =
    "SELECT passwords,username,email FROM createaccount WHERE email = ?";
  const value = [email];

  connection.query(sql, value, async (error, result) => {
    if (error) {
      console.log("reverted with: ", error);
      res.status(500).json({
        message: "internal server error",
        type: "query error",
        status: 500,
      });
    }

    if (result == 0) {
      console.log("does not exist");
      res.status(404).json({
        message: "account does not exist",
        type: "",
        status: 404,
      });
    }

    const encrypted_password = result[0].passwords;
    const DBusername = result[0].username;
    const DBemail = result[0].email;
    try {
      const passwordMatch = await bcrypt.compare(password, encrypted_password);

      if (passwordMatch) {
        const token = jwt.sign(
          { DBusername, DBemail, encrypted_password },
          process.env.SECRET,
          {
            expiresIn: "1h",
          }
        );

        res.cookie("token", token, {
          httpOnly: true,
        });
        res.status(200).json({ message: "login successfull", status: 200 });
      } else {
        console.log("incorrect password");
        res.status(401).json({
          message: "incorrect password",
          type: "unAuthorized",
          status: 401,
        });
      }
    } catch (erro) {
      console.error(error);
      res.status(500).json({
        message: "internal server erro",
        type: "server returned error",
        status: 500,
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}...`);
});
