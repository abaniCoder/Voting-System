const express = require('express') ;
const Router = require('./Routes/Routes');
const app = express() ; 
const port = 3000 ;
//set ejs 
app.set('view engine','ejs') // this line sets ejs engine to render html pages 
app.use(express.static('Public')) ;
app.use('/CSS', express.static('Public/CSS'))
//setup routes
app.use('/',Router) ;
app.listen(port,()=>{
    console.log('Server running on port',port) ;
})