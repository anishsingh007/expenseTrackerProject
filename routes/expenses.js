const express = require("express");
const path = require("path");
const router = express.Router();
const expenses= require('../models/expenses')

const expenseController = require('../controller/expenses')
const userauthentication = require('../middleware/auth')





router.post('/addexpense',userauthentication.authenticate,expenseController.addexpense)
router.get('/getexpenses',userauthentication.authenticate,expenseController.fetchexpenses)
router.delete('/deleteexpense/:id', async (req, res) => {
    try {
      const expenseid = req.params.id;
    // Use the expenseId to delete the expense from the database
    await expenses.destroy({ where: { id: expenseid } });

      // Return a success response
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  


module.exports = router;
