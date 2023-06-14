// Event listener for form submission
const expenseForm = document.querySelector('#expenseForm');
expenseForm.addEventListener('submit', handleFormSubmit);

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
      category
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
    await axios.post('http://localhost:3000/addexpense', expense);
  } catch (error) {
    console.error(error);
  }
}

// Function to fetch expenses from the backend
function fetchExpenses() {
  axios.get('http://localhost:3000/getexpenses')  // Replace with the appropriate URL for fetching expenses
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
    if (Array.isArray(expenses)) {
      expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${expense.date}</td>
          <td>${expense.amount}</td>
          <td>${expense.description}</td>
          <td>${expense.category}</td>
          <td>
            <button onclick="deleteExpense(${expense.id})">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      console.error('Invalid expenses data:', expenses);
    }
  }
  
  

// Fetch expenses on page load
fetchExpenses();
