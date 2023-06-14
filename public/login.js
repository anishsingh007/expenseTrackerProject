async function login(e) {
  e.preventDefault();
  console.log(e.target.name);

  const loginDetails = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  console.log(loginDetails);

  await axios
    .post("http://localhost:3000/user-login", loginDetails)
    .then((response) => {
      if (response.status === 200) {
        alert(response.data.message);
        window.location.href='/dashboard.html'
      }
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
      document.body.innerHTML += `<div style='color:red;'>${err.message}<div>`;
    });
}
