

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
    }catch(err){
        document.body.innerHTML += `<div style='color:red'>${err} <div>`;
    }
}






