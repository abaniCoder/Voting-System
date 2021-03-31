const express = require('express') ;
const Router = require('./Routes/Routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express() ; 
const port = 3000 ;
//set ejs 
app.set('view engine','ejs') // this line sets ejs engine to render html pages 
app.use(express.static('Public')) ;
app.use('/CSS', express.static('Public/CSS'));
app.use(bodyParser());
//setup routes
app.use('/',Router) ;
app.listen(port,()=>{
    console.log('Server running on port',port) ;
})

//set up database
const DBUrl = 'mongodb+srv://Server:1234@cluster0.0ychj.mongodb.net/Server?retryWrites=true&w=majority'
//set up database
mongoose.connect(DBUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database up and running');;
    }).catch(() => {
        console.log('Something went wrong');
    });
