

async function signup(e){
    try{
        e.preventDefault();
        console.log(e.target.name.value);
      
        const signupDetails ={
            name: document.getElementById("name").value,
            email:document.getElementById("email").value,
            password:document.getElementById("password").value
        }
        console.log(signupDetails)
        await axios.post('http://localhost:3000/user-signup',signupDetails)
        
    }catch(err){
        document.body.innerHTML += `<div style='color:red'>${err} <div>`;
    }
}






