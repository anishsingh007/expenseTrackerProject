const express= require('express');
const path = require('path');
var cors = require('cors')
const sequelize = require('./util/database')
const bodyParser = require('body-parser')
const User = require('./models/users')
const Expense = require("./models/expenses")
const Order = require('./models/orders')
const { authenticate } = require('./middleware/auth');

const mysql = require('mysql');

const app=express();

const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expenses')
const purchaseRoutes = require('./routes/purchase')


app.use(bodyParser.json());//used for parsing data from body
app.use(express.static(path.join(__dirname,'public')));
app.use(cors())


app.use(userRoutes)
app.use(authenticate);
app.use(expenseRoutes)
app.use(purchaseRoutes)

User.hasMany(Expense);
Expense.belongsTo(User);


User.hasMany(Order);
Order.belongsTo(User);

// app.use((req,res,next)=>{
//     res.status(404).sendFile(path.join(__dirname, 'public', '404error.jpg'))
// })

sequelize.sync()
    .then(() => {
        app.listen(3000);
        console.log('success');
    })
    .catch(err => {
        console.log(err);
    })
