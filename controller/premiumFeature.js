// const User = require('../models/users');
// const Expense = require('../models/expenses');
// const sequelize = require('../util/database');
// const e = require('express');

// const getUserLeaderBoard = async (req, res) => {
//     try{
//         const users = await User.findAll();
//         const expenses = await Expense.findAll();
//         const userAggregatedExpenses ={}
//         console.log(expenses);
//         expenses.forEach((expense) => {
//             if(userAggregatedExpenses[expense.userId]){
//                 userAggregatedExpenses[expense.userId]= userAggregatedExpenses[expense.userId] + expense.amount
//             }else{
//                 userAggregatedExpenses[expense.userId]= expense.amount
//             }
            
//         })
//         var userLeaderBoardDetails =[];
//         users.forEach((user)=>{
//             userLeaderBoardDetails.push({name:user.name, total_cost:userAggregatedExpenses[user.id]})
//         })
//         console.log(userLeaderBoardDetails);
//         userLeaderBoardDetails.sort((a,b)=>b.total_cost-a.total_cost)
//         res.status(200).json(userLeaderBoardDetails)
    
// } catch (err){
//     console.log(err)
//     res.status(500).json(err)
// }
// }

// module.exports = {
//     getUserLeaderBoard
// }

const User = require('../models/users');
const Expense = require('../models/expenses');
const sequelize = require('../util/database');
const e = require('express');

const getUserLeaderBoard = async (req, res) => {
    try{
        const leaderboardofusers = await User.findAll({
            attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost'] ],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group:['user.id'],
            order:[['total_cost', 'DESC']]

        })
       
        res.status(200).json(leaderboardofusers)
    
} catch (err){
    console.log(err)
    res.status(500).json(err)
}
}

module.exports = {
    getUserLeaderBoard
}