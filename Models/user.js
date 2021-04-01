const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require:true 
    }
    , id: {
        type: String,
        require:true
    },
    password: {
        type: String,
        require:true
    },
    voted: {
        type: Map
    },
    email: {
        type: String,
        require: true
    } ,
    role : {
        type : Boolean ,
        default:false
    }
})

module.exports = mongoose.model('user', userSchema);