const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
    'message':{
        type: String
    },
    'senderId':{
        type: mongoose.Types.ObjectId
    },
    'senderName':{
        type:String
    }
})
module.exports = mongoose.model('Message', MessageSchema)