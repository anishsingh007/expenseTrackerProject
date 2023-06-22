const Expense = require('../models/expenses');
const jwt = require("jsonwebtoken");
const User = require('../models/users');
const sequelize = require('../util/database')

const addexpense = async (req, res) => {
    try {
      const t = await sequelize.transaction();   //sequelize transaction promise
  
      const { amount, description, category } = req.body;
      console.log(req.body);
  
      if (amount == undefined || amount.length === 0) {
        return res.status(400).json({ success: false, message: 'Parameters missing' });
      }
  
      const expense = await Expense.create(
        { amount, description, category, userId: req.user.id },
        { transaction: t }
      );
  
      const totalExpense = Number(req.user.totalExpenses) + Number(amount);
      console.log(totalExpense);
  
      await User.update(
        { totalExpenses: totalExpense },
        { where: { id: req.user.id }, transaction: t }
      );
  
      await t.commit(); // commit to make the changes save
  
      res.status(200).json({ expense: expense });
    } catch (err) {
      await t.rollback(); // rollback to revert
      return res.status(500).json({ success: false, error: err });
    }
  };
  

const fetchexpenses = (req, res) => {
  Expense.findAll({ where: { userId: req.user.id } })
    .then((expenses) => {
      return res.status(200).json(expenses);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err, success: false });
    });
};

const deleteexpense = async (req, res) => {
    const expenseid = req.params.expenseid;
    
    if (expenseid == undefined || expenseid.length === 0) {
      return res.status(400).json({ success: false });
    }
  
    const t = await sequelize.transaction();
  
    try {
      const noofrows = await Expense.destroy({
        where: { id: expenseid, userId: req.user.id },
        transaction: t
      });
  
      if (noofrows === 0) {
        await t.rollback();
        return res.status(404).json({ success: false, message: 'Expense doesn\'t belong to the user' });
      }
  
      await t.commit();
      return res.status(200).json({ success: true, message: 'Deleted Successfully' });
    } catch (err) {
      await t.rollback();
      console.log(err);
      return res.status(500).json({ success: false, message: 'Failed' });
    }
  };
  

module.exports = {
  deleteexpense,
  addexpense,
  fetchexpenses
};
