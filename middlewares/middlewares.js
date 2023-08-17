const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connection } = require("../connect.js");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({
      message: "token does not exist or has expired",
      status: 301,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded.id;
    console.log(req.userId);
    next();
  } catch (e) {
    return res.status(401).json({ message: e });
  }
};

const checkExists = (req, res, next) => {
  const email = req.body.email; // Assuming the email is present in the request body

  try {
    connection.query(
      "SELECT COUNT(*) AS email_count FROM createaccount WHERE email = ?",
      [email],
      (error, result) => {
        if (error) {
          console.log("reverted with: ", error);
          return res.status(500).json({
            message: "internal server error",
            type: "query error",
            status: 500,
          });
        }

        const emailCount = result[0].email_count;
        if (emailCount > 0) {
          return res.status(200).json({ message: "Account already exists" });
        } else {
          next();
        }
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e });
  }
};

module.exports = { verifyToken, checkExists };
