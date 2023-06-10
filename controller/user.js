const User = require("../models/users");


const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("email", email);
    if (
      isstringinvalid(name) ||
      isstringinvalid(email || isstringinvalid(password))
    ) {
      return res
        .status(400)
        .json({ err: "Bad parameters . Something is missing" });
    }else{

    await User.create({ name, email, password: hash });
    res.status(201).json({ message: "Successfuly create new user" });
    
  }} catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  signup,
};
