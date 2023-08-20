const express = require("express");
const { connection } = require("./connect.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const { verifyToken, checkExists } = require("./middlewares/middlewares.js");

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
app.use(
  cors({
    origin: "http://localhost:5173", // frontend url
    credentials: true,
  })
);
app.use(cookieParser());

app.post("/api/signup", checkExists, async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ message: "not complete", type: "error", status: 404 });
  }

  try {
    const encrypted_password = await bcrypt.hash(
      password,
      parseInt(process.env.SALTROUNDS)
    );

    const sql =
      "INSERT INTO createaccount(username,passwords,email) VALUES(?,?,?)";
    const values = [name, encrypted_password, email];

    connection.query(sql, values, (error, result) => {
      if (error) {
        console.error("reverted with: ", error);
        return res.status(500).json({
          message: "internal server error",
          type: "sql error",
          status: 500,
        });
      } else {
        connection.query(
          `SELECT id FROM createaccount WHERE username = ? AND passwords = ? AND email = ?`,
          [name, encrypted_password, email],
          (error, result) => {
            if (error) {
              console.log(error);
            } else {
              const id = result[0].id;
              const token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: "1h",
              });
              res.cookie("token", token, {
                httpOnly: false,
              });
              return res
                .status(200)
                .json({ message: "account created", status: 200 });
            }
          }
        );
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      type: "hashing error",
      status: 500,
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        message: "incomplete data",
        type: "error",
        status: 400,
      });
    }

    const sql =
      "SELECT passwords,username,email FROM createaccount WHERE email = ?";
    const value = [email];

    connection.query(sql, value, async (error, result) => {
      if (error) {
        console.log("reverted with: ", error);
        return res.status(500).json({
          message: "internal server error",
          type: "query error",
          status: 500,
        });
      }

      if (result.length === 0) {
        console.log("does not exist");
        return res.json({
          message: "email is not registered",
          type: "",
          status: 404,
        });
      }

      const id = result[0].id;
      const encrypted_password = result[0].passwords;

      try {
        const passwordMatch = await bcrypt.compare(
          password,
          encrypted_password
        );

        if (passwordMatch) {
          const token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: "1h",
          });

          res.cookie("token", token, {
            httpOnly: false,
          });
          return res
            .status(200)
            .json({ message: "login successful", status: 200 });
        } else {
          console.log("incorrect password");
          return res.json({
            message: "incorrect password",
            type: "unAuthorized",
            status: 401,
          });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          message: "internal server error",
          type: "server returned error",
          status: 500,
        });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "internal server error",
      type: "server error",
      status: 500,
    });
  }
});
app.get("/api/getprofile/:id", verifyToken, (req, res) => {
  const { id } = req.params; // Change 'userId' to 'id'
  connection.query(
    "SELECT username, email, profilepik FROM createaccount WHERE id = ?",
    [id],
    (error, result) => {
      if (error) {
        console.log("reverted with: ", error);
        return res.status(500).json({
          message: "internal server error",
          type: "query error",
          status: 500,
        });
      }

      // Check if there is a result
      if (result.length === 0) {
        return res.json({
          message: "User not found",
          status: 404,
        });
      }

      // Access the first element of the result array
      const { username, email, profilepik } = result[0];

      res.json({
        userdata: {
          name: username,
          email: email,
          profilePicture: profilepik,
        },
        status: 200,
        createdBy: "chidubem_okafor",
      });
    }
  );
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("token"); // Clear the authentication cookie
  res.status(200).json({ message: "Logged out successfully" });
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}...`);
});
