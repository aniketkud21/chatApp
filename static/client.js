const sendBtn = document.getElementById('.container')
const socket = io.connect()

const form = document.getElementById('send-container')
const messageInp = document.getElementById('messageInp')
const messageContainer = document.querySelector('.container')

var userId=null
const initialize = async()=>{
    const resp = await fetch('/user')
    const data = await resp.json()
    console.log(data.user_id)
    socket.emit('new user', data.user_id)

    const resp2 = await fetch('/messages')
    const data2 = await resp2.json()
    console.log(data2)
    console.log(data2.message.length)
    for(let i=0;i<data2.message.length;i++){
        let messageObj = data2.message[i]
        if(data.user_id==messageObj.senderId){
            append(`You: ${messageObj.message}`, 'right')
        }
        else{
            append(`${messageObj.senderName}: ${messageObj.message}`, 'left')
        }
    }

    return data.userId
}

userId = initialize()

// fetch('/user')
// .then((response)=>{
//     response.json()
//     .then((data)=>{
//         userId=data.userId
//         console.log(data)
        
//     })
// })
// .catch((err)=>{
//     console.log(err);
// })

socket.on('user joined' , (name)=>{
    append(`${name} joined the chat`, 'right')
})

const append = (message, position)=>{
    const messageElement = document.createElement('div')
    messageElement.innerText=message
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    messageContainer.append(messageElement)
}

form.addEventListener('submit', (event)=>{
    event.preventDefault()
    const message = messageInp.value;
    socket.emit('send' ,message)
    append(`You: ${message}`, 'right')
    messageInp.value=''
})

socket.on('receive', (data)=>{
    append(`${data.name}: ${data.message}`, 'left')
    console.log(data.name + data.message)
})

