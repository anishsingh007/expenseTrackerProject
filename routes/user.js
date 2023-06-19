const express = require("express");
const path = require("path");
const router = express.Router();


const userController = require('../controller/user')


router.get('/',(req,res)=>res.redirect('/signup')) //redirecting empty url to deafualt signup page


//sending file to render on /signup
router.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/signup.html'))

});
router.post('/user-signup',userController.signup);


router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/login.html'))

});

router.post('/user-login',userController.login);


module.exports = router;
