const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticate = (req, res, next) => {    
    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token, '0e14a20488215bd3e75531742894adda7b85a21b434d5fa13a5dbf15555c76f1');
        console.log('userID >>>> ', user.userId)
        User.findByPk(user.userId).then(user => {

            req.user = user; ///ver
            next();
        })

      } catch(err) {
        console.log(err);
        return res.status(401).json({success: false,message: 'Authentication failed'})
        // err
      }

}

module.exports = {
    authenticate
}