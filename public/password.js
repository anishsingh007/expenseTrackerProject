async function forgotpassword(e) {
    e.preventDefault();
    console.log('Line 3:', e.target.name); // Add this line
    const form = new FormData(e.target);
  
    const userDetails = {
      email: form.get("email"),
    };
    console.log('Line 10:', userDetails); // Add this line
  
    try {
      const response = await axios.post('http://localhost:3000/password/forgotpassword', userDetails);
      if (response.status === 202) {
        document.body.innerHTML += '<div style="color:red;">Mail Successfully sent </div>'; // Fixed typo in HTML tag
      } else {
        throw new Error('Something went wrong!!!');
      }
    } catch (err) {
      document.body.innerHTML += `<div style="color:red;">${err} </div>`;
    }
  }
  