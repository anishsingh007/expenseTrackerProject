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
        const response =await axios.post('http://localhost:3000/user/signup',signupDetails)
            if (response.status===201){
            }else{

            }
    }catch(err){
        document.body.innerHTML += `<div style='color:red'>${err} <div>`;
    }
}
