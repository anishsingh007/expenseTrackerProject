const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    console.log(req.headers);
    console.log('Token:', token);

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    jwt.verify(token, 'anish1234567890', (err, decoded) => {
      if (err) {
        console.log('Error:', err);
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const userId = decoded.userId;
      console.log('User ID:', userId);

      User.findByPk(userId)
        .then(user => {
          if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
          }

          req.user = user;
          next();
        })
        .catch(error => {
          console.log('Database error:', error);
          res.status(500).json({ success: false, message: 'Database error' });
        });
    });
  } catch (error) {
    console.log('Exception:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  authenticate
};