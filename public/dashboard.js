// Event listener for form submission
const expenseForm = document.querySelector('#expenseForm');
expenseForm.addEventListener('submit', handleFormSubmit);

// leaderboard button hinding
const lbButton = document.getElementById('lbButton');
lbButton.style.display = 'none';


// Function to handle form submission
async function handleFormSubmit(event) {
  try {
    event.preventDefault();

    const amount = document.querySelector('#amount').value;
    const description = document.querySelector('#description').value;
    const category = document.querySelector('#category').value;

    const expense = {
      amount: parseFloat(amount),
      description,
      category,
      
    };

    // Send the expense data to the backend
    await addexpense(expense);

    // Fetch the updated list of expenses
    fetchExpenses();

    // Reset the form fields
    document.querySelector('#amount').value = '';
    document.querySelector('#description').value = '';
    document.querySelector('#category').value = 'Food';
  } catch (error) {
    console.error(error);
    document.body.innerHTML += `<div style='color:red'>${error} <div>`;
  }
}

// Function to send the expense data to the backend
async function addexpense(expense) {
  
  try {
    const token = localStorage.getItem('token'); 
    await axios.post('http://localhost:3000/addexpense', expense,{headers: {'Authorization': token}});
  } catch (error) {
    console.error(error);
  }
}




// Function to fetch expenses from the backend
function fetchExpenses() {
  const token = localStorage.getItem('token')
 console.log(token);
  axios.get('http://localhost:3000/getexpenses',{headers: {'Authorization': token}})
    .then(response => {
      const expenses = response.data;
      renderExpenses(expenses);
      
    })
    .catch(error => {
      console.error(error);
    });
}

// Function to render expenses in the table
// Function to render expenses in the table
function renderExpenses(expenses) {
    console.log(expenses); // Log the value of expenses to check if it's an array
    const tableBody = document.querySelector('#expenseTable tbody');
    tableBody.innerHTML = '';
  
    // Check if expenses is an array
      expenses.forEach(expense => {
        //changinging createdAt to a suitable date format
        const date = new Date(expense.createdAt);
        const formattedDate = `${date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' })} ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}`;
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${formattedDate}</td>
          <td>${expense.amount}</td>
          <td>${expense.description}</td>
          <td>${expense.category}</td>
          <td>
            <button onclick="deleteExpense(${expense.id})">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
   
  }
 
  // Function to delete an expense
async function deleteExpense(expenseid) {
    console.log(expenseid);
    const token = localStorage.getItem('token');
    // Send the expense ID to the backend for deletion
  await  axios.delete(`http://localhost:3000/deleteexpense/${expenseid}`,{headers: {'Authorization': token}})
      .then(response => {
        // Log the response if needed
      
        // Fetch the updated list of expenses
        fetchExpenses();
      })
      .catch(error => {
        console.error(error);
      });
  }
  

// Fetch expenses on page load
fetchExpenses();


function showError(err){
  document.body.innerHTML += `<div style="color:red;"> ${err}2</div>`
}

//show leaderboard function

function showLeaderboard(){
  lbButton.style.display = 'block';
  lbButton.onclick= async ()=>
  {
    const token = localStorage.getItem('token')
    const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard',{headers: {'Authorization': token}})
    console.log(userLeaderBoardArray)

    const leaderBoardElem= document.getElementById('leaderboard');
    leaderBoardElem.innerHTML += '<h1> Leader Board</h>'
   userLeaderBoardArray.data.forEach((userDetails)=>
    leaderBoardElem.innerHTML += `<li> Name - ${userDetails.name} Total Expense - ${userDetails.total_cost}</li>`)
  }
}


// ...

function download() {
  const token = localStorage.getItem('token');
  console.log(token);
  axios
    .get('http://localhost:3000/download', { headers: { Authorization: token } })
    .then((response) => {
      if (response.status === 200 && response.data.success) {
        const fileURL = response.data.fileURL;
        window.open(fileURL);
      } else {
        throw new Error('Failed to download expenses');
      }
    })
    .catch((err) => {
      showError(err);
    });
}



 // Premium button handler
 function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function showPremiumUserMessage(name) {
  document.getElementById('rzp-button1').style.visibility = 'hidden';
  document.getElementById('message').innerHTML = `Hi ${name}! You are a Premium User Now!`;
}

window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const decodeToken = parseJwt(token);
  console.log(decodeToken);
  const isPremiumUser = decodeToken.ispremiumuser;
  const name = decodeToken.name;
  if (isPremiumUser && name) {
    showPremiumUserMessage(name);
    showLeaderboard()
  }
});


 document.getElementById('rzp-button1').onclick = async function(e) {

const token = localStorage.getItem('token')
  const response= await axios.get('http://localhost:3000/premiummembership',{headers: {'Authorization': token}})
  console.log(response);
  var options = 
  {
    "key":response.data.key_id,
    "order_id":response.data.order.id,
    "handler":async function(response){
      await axios.post('http://localhost:3000/updatetransactionstatus',{
      order_id: options.order_id,
      payment_id: response.razorpay_payment_id,
    },{headers: {'Authorization': token}})

    alert('You are a Premium user Now')
    
    document.getElementById('rzp-button1').style.visibility = 'hidden';
    document.getElementById('message').innerHTML = `Hi ${name}! You are a Premium User Now!`
    showLeaderboard()
    },
  };

  const rzp1= new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function(response){
    console.log(response)
    alert('Something Went Wrong')
  })
    };

    