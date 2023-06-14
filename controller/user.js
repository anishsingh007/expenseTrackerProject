const User = require('../models/users');

const isstringinvalid = (value) => {
    return typeof value !== "string" || value.trim().length === 0;
  };
  

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body.name);
    // await User.create({ name:req.body.name, email:req.body.email, password:req.body.password });
    // res.status(201).json({ message: "Successfully create new user" });
    if (
      isstringinvalid(name) ||
      isstringinvalid(email) ||
      isstringinvalid(password)
    ) {
      return res
        .status(400)
        .json({ err: "Bad parameters. Something is missing" });
    } else { console.log('hello');
      await User.create({ name:req.body.name, email:req.body.email, password:req.body.password });
      res.status(201).json({ message: "Successfully create new user" });
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (isstringinvalid(email) || isstringinvalid(password)) {
      return res
        .status(400)
        .json({ message: "Email id or password is missing", success: false });
    }

    const user = await User.findAll({ where: { email } });
    if (user.length > 0) {
      if (user[0].password === password) {
        res.status(200).json({
          success: true,
          message: "User logged in successfully",
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Password is incorrect" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }
  } catch (err) {
    res.status(500).json({ message: err, success: false });
  }
};

const userLogin = async (req, res) => {
    try {
      // Implementation for user login
    } catch (err) {
      res.status(500).json({ message: err, success: false });
    }
  };

module.exports = {
  signup,
  login,userLogin
};
