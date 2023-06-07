const express= require('express');
const path = require('path');
var cors = require('cors')

const mysql = require('mysql');
const connection = mysql.createConnection ({
    host:'localhost',
    user:'root',
    password:'180828',
    database:'expensetracker'
})
const app=express();

app.use(express.static(path.join(__dirname)));
app.use(cors())

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'signup.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));

async function signup(e){
    try{
        e.preventDefault();
        console.log(e.target.email.value);

        const signupDetails ={
            name: document.getElementById("name").value,
            email:document.getElementById("email").value,
            password:document.getElementById("password").value
        }
        console.log(signupDetails)
        
        await createTable();
    }catch(err){
        document.body.innerHTML += `<div style='color:red'>${err} <div>`;
    }
}

function createTable(){
    return new Promise((resolve,reject) => {
        const CreateTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )`;

        connection.query(CreateTableQuery,(error,results)=>{
            if (error){
                reject(error);
            }else{
                resolve();
            }
        })
    })
}

function insertData(signupDetails) {
    return new Promise((resolve, reject) => {
        const insertQuery = `
            INSERT INTO users (email, password)
            VALUES (?, ?)
        `;
        const values = [signupDetails.email, signupDetails.password];

        connection.query(insertQuery, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

// Establish connection and call the signup function
connection.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL:', error);
    } else {
        console.log('Connected to MySQL!');
        // Call the signup function or attach it to an event listener
    }
});

app.listen(3000)


