const Sequelize = require('sequelize');
const mysql = require('mysql2')

const sequelize = new Sequelize('expensetracker', 'root', '180828', {
    dialect: 'mysql',
    host: 'localhost'
  });
  
  module.exports = sequelize;