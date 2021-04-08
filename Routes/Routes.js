const { response } = require('express');
const express = require('express') ;
const { mapReduce } = require('../Models/candidate');
const Candidate = require("../Models/candidate");
const Router = express.Router();
const User= require('../Models/user'); 
const Dept = require('../Models/department');
const { loadVotingCandidates} = require("../Helper/helper")

//Home route 
Router.get('/',(req,res)=>{
    res.render('index' ,{msg:''});
}) 

Router.post('/',(req,res)=>{  
    console.log("ok")
    if(!req.body.id||!req.body.password){
        console.log("ok1")
        res.render('index',{msg :"Empty Fields"}) ;
    } else {
     User.findOne({id:req.body.id},(err,user)=>{ 
         if(err||!user || user.password !==req.body.password){
             res.render('index',{msg :"Credentials  didnt match"}) ;
         }  
         else{ 
             if(user.role===true){
                 res.redirect('/admin') ;
             } else {
             res.redirect('/user?id='+user.id) ;
             }
         }
     }) } 
})

//register routes
Router.get('/register',((req,res)=>{ 
res.render('register',{error:""}) ;
}))
Router.post('/register',((req,res)=>{
    const user=new User(req.body); 
    User.findOne({id:req.body.id},(err,response)=>{
            if(err||!response){
                // save new user 
                user.save() ; 
                res.redirect("/user/?id="+req.body.id) ;
            } 
            else {
                res.render('register',{error:"Already Exist"}) ;
            }
    })
}))

//add department routes
Router.get('/adddept',((req,res)=>{ 
    res.render('adddept',{ error: "" }) ;
}))
Router.post('/adddept', ((req, res) => {
    if (req.body.name && req.body.date) {
        const Department = new Dept(req.body);
        Dept.findOne({ name: req.body.name }, (err, dept) => {
            if (err || !dept) {
                Department.save();
                Dept.find((err, response) => {
                    res.redirect('/admin');
                })
            }
            else { res.render('adddept', { error: "Already Exist" }); }
       })
    }
    else {
        res.render('adddept', { error: "Missing form" });
    }
}))
//delete department route
Router.get('/delete', (req,res) => {
    console.log(req.query);
    Candidate.deleteMany({ department: req.query.name }, (err, response) => {
    });
    console.log(req.query.name);
    Dept.findOneAndDelete({ name:req.query.name}, function (err) {
         if(err) console.log(err);
         console.log("Successful deletion");
    });
    res.redirect('/admin');
})
//delete candidate route 
Router.get('/delete/candidate', (req,res) => {
    console.log(req.query);
    Candidate.deleteOne({ id: req.query.id}, (err, response) => {
    });
    res.redirect('/viewcandidates/?department=' + req.query.department);
   
})
//add candidate
Router.get('/addcandi', ((req, res) => {
    Dept.find((err, response) => {
        console.log(response);
        if (err || response.length === 0) {
            console.log(response);
           res.render('addcandi', { department: [] ,error: true ,msg : "" });
        }
        else {
            res.render('addcandi', { department: response,error:false,msg : "" });
        }
    })
}))

Router.post('/addcandi', ((req, res) => {
    console.log(req.body.department);
    if (req.body.name && req.body.id && req.body.department!=="Department") {
        const candidate = new Candidate(req.body);
        Candidate.findOne({ id: req.body.id }, (err, response) => {
            if (err || !response) {
                candidate.save();
            }
            return res.redirect('/admin');
        })
    }
    else {  
        Dept.find((err, response) => {
            console.log(response);
            if (err || response.length === 0) {
                console.log(response);
               res.render('addcandi', { department: [] ,error: true ,msg : "Fields Missing" });
            }
            else {
                res.render('addcandi', { department: response,error:false,msg : "Fields Missing" });
            }
        })
    }
}))

//admin view routes
Router.get('/admin',((req,res)=>{
    Dept.find((err, response) => {
        console.log(response);
        if (err || response.length === 0) {
            console.log(response);
           res.render('adminpage', { department: [] ,error: true  });
        }
        else {
            res.render('adminpage', { department: response,error:false });
        }
    })
}))
    
//view candidates under a departemnt
Router.get('/viewcandidates', (req, res) => {
    const dept = req.query.department;
    Candidate.find({ department: dept }, (err, candidate) => {
        if (err || !candidate) {
            //do some stuff
            res.render('viewdepcandi', { department: dept, candidates: [],error:true });
        }
        else {
            console.log(candidate,dept);

            res.render('viewdepcandi', { department: dept, candidates: candidate,error:false });
        }
    })
}) 

//organise poll 
Router.get("/organisepol" ,(req,res)=>{ 
    console.log(req.body) ;
    Dept.find({selected:false},(err, response) => {
       // console.log(response);
        if (err || response.length===0) {
            console.log("this");
           res.render('organise', { department: [] ,error: true  ,msg:"No Department Found" });
        }
        else {
            console.log("thione")
            res.render('organise', { department: response,error:false ,msg:'' });
        }
    })
}) 

Router.post("/organisepol" ,(req,res)=>{ 
    console.log(req.body) ; 
    Dept.findOneAndUpdate({name:req.body.select},{selected:true},(err,response)=>{
        if(err||!response){
            res.redirect("/organisepol") ;
        } 
        else {
            res.redirect("/admin") ;
        }
    })
   
})
// voting route

Router.get("/voting", async(req, res) => {
    //Get department from database 
    //Also get its coresponding candidates  
    //Bug 
    // console.log(req.query.id)
   
    var votingCandidates = new Map();
    votingCandidates =  await loadVotingCandidates(req.query.id);
    res.render('voting', { votingcandidates: votingCandidates, error: false, msg: '', id: req.query.id });   
        
})

    Router.post('/voting', async(req,res) => {
        console.log(req.body);
       await User.findOne({ id: req.query.id },async (err,user) => {
            if (err || !user) {
                //Do some stuff
            }
            else {
                user.voted.set(req.body.select,req.body.select);
               await user.save();
               await Candidate.findOne({ id: req.body.id }, async(err,candidate) => {
                    candidate.points += 1;
                   await candidate.save();
                }) 
                res.redirect('/voting/?id=' + req.query.id);
            }
        })
    })

//user route
Router.get("/user",(req,res)=>{  
    User.findOne({id:req.query.id},(err,user)=>{
           if(err||!user){
               //run kro
           } 
           else {
            res.render('userpage',{email:user.email,id:user.id,name:user.name}) ;
           }
    })
})

module.exports = Router ;