const express = require("express");
const path = require("path");
const router = express.Router();


const expenseController = require('../controller/expenses')




router.post('/addexpense',expenseController.addexpense)
router.get('/getexpenses',expenseController.fetchexpenses)
router.delete('/deleteexpense/:id', async (req, res) => {
    try {
      const expenseid = req.params.id;
      // Use the expenseId to delete the expense from the database
  
      // Return a success response
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  


module.exports = router;
