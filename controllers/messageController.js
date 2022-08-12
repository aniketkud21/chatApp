const Messages = require('../models/messages')

const addMessage = (message, senderId, senderName)=>{
    const newMessage = new Messages({
        message:message,
        senderId:senderId,
        senderName:senderName
    })
    try{
        newMessage.save()
    }
    catch(err){
        console.log(err);
    }
}

const getMessages = async()=>{
    var messages={}
    try {
        const resp = await Messages.find() 
        messages = resp
    } catch (error) {
        console.log(error);
    }
    return messages
}

module.exports.addMessage = addMessage
module.exports.getMessages = getMessages