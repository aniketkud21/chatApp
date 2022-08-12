console.log('File')

const loginForm = document.getElementById('login-form')
const submitBtn = document.getElementById('submit-btn')

loginForm.addEventListener('submit',async (event)=>{
    
    event.preventDefault();
    
    console.log('eventlistener')
    const response = await fetch(event.target.action,{
        method:'POST',
        body: new URLSearchParams(new FormData(event.target))
    })
    const body = await response.json();
    if(body.success){
        
        
        // var newwin = window.open("socket.html");
        // window.close()
        // newwin.socket= socket;
            // newwin.onload = () => {
            //     newwin.socket = socket;
            // };
        
        //localStorage.setItem('socket', JSON.stringify(socket))
        window.location='http://localhost:5000/protected'
    }
    console.log(body)
})