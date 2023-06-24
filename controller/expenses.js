const Expense = require('../models/expenses');
const jwt = require("jsonwebtoken");
const User = require('../models/users');
const sequelize = require('../util/database')
const AWS = require('aws-sdk');

const fetchexpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    return res.status(200).json(expenses);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err, success: false });
  }
};

function uploadToS3(data, filename) {
  const BUCKET_NAME = 'myexpensetracker101';
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  const s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: 'public-read'
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log('Something went wrong', err);
        reject(err);
      } else {
        console.log('Upload success', s3response);
        resolve(s3response.Location);
      }
    });
  });
}



const downloadExpense = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const userName =req.user.name;
   
    const filename = `Expense${userName}/${new Date()}.txt`;

    const fileURL = await uploadToS3(stringifiedExpenses, filename);
    console.log(fileURL);
    res.status(200).json({ fileURL, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err, success: false });
  }
};


const addexpense = async (req, res) => {
  let t;
  try {
    t = await sequelize.transaction();

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

    await t.commit();

    res.status(200).json({ expense: expense });
  } catch (err) {
    if (t) await t.rollback();
    console.log(err);
    return res.status(500).json({ success: false, error: err });
  }
};

const deleteexpense = async (req, res) => {
  const expenseid = req.params.expenseid;

  if (expenseid == undefined || expenseid.length === 0) {
    return res.status(400).json({ success: false });
  }

  let t;
  try {
    t = await sequelize.transaction();

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
    if (t) await t.rollback();
    console.log(err);
    return res.status(500).json({ success: false, message: 'Failed' });
  }
};

module.exports = {
  deleteexpense,
  addexpense,
  fetchexpenses,
  downloadExpense
};
