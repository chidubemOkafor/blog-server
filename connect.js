const mongoose = require("mongoose");
require("dotenv").config()
const url = `mongodb+srv://okaforchidubem7:${process.env.password}@cluster0.sxautn2.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)
// Check for successful connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
  console.log('Connected to MongoDB Atlas')
});

module.exports = {db}