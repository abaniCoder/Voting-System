const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
    name: {
        type: String,
        require:true 
    }
    , date: {
        type: String,
        require:true
    } ,
    selected : {
        type : Boolean ,
        default: false
    }
})

module.exports = mongoose.model('department', departmentSchema);