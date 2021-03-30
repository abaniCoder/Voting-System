const express = require('express') ;
const Router = express.Router() ;
Router.get('/',(req,res)=>{
    res.render('index');
})
Router.get('/register',((req,res)=>{
res.render('register') ;
}))

module.exports = Router ;