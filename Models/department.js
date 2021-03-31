const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
    name: {
        type: String,
        require:true 
    }
    , date: {
        type: String,
        require:true
    }
})

module.exports = mongoose.model('department', departmentSchema);