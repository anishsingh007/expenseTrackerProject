const express = require("express");
const path = require("path");
const router = express.Router();


const userController = require('../controller/user')

router.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname, '../view/signup.html'))   
})
router.post("/signup",userController.signup);

router.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "../view", "login.html"))
);

module.exports = router;
