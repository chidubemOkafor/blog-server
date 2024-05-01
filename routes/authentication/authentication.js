const express = require("express");
const router = express.Router();
const AuthController = require("../../controllers/AuthController");

router.post("/signup", AuthController.Signup);
router.post("/login/:firebaseUid", AuthController.Login);

module.exports = router;
