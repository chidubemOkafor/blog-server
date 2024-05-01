const { User } = require("../schema/schema.js");

class AuthController {
  static async Signup(req, res) {
    try {
      console.log(req.body);
      const { user_name, firebase_uid, profile_picture } = req.body;
      const user = new User({ user_name, firebase_uid, profile_picture });
      const newUser = await user.save();
      // get the user in
      const userInfo = await User.findOne({ _id: newUser._id });
      console.log(userInfo);
      res.status(200).json({ message: "User Created", response: userInfo });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  }

  static async Login(req, res) {
    try {
      const { firebaseUid } = req.params;
      console.log(firebaseUid);
      const user = await User.findOne({ firebase_uid: firebaseUid });
      console.log(user);
      if (user) {
        res.status(200).json({ message: "User found", response: user });
      } else {
        res.status(404).json({ message: "user does not exist" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "internal server error" });
    }
  }
}

module.exports = AuthController;
