const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    text:{
        type: String,
        required: true,
    },
    from:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        required: true,
    }
})

const Message = mongoose.model('Message',MessageSchema);

module.exports = { Message }