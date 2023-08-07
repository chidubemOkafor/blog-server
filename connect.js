const mysql = require("mysql2");
require("dotenv").config();

const password = process.env.password;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: password,
  database: "aurora",
});

module.exports = { connection };
