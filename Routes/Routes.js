const { response } = require('express');
const express = require('express') ;
const Candidate = require("../Models/candidate");
const Router = express.Router();
const Dept = require('../Models/department');
const User= require("../Models/user"); 
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
    Dept.deleteOne({ name: req.query.name }, (err, response) => {
                res.redirect("/admin")
    });
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
    Dept.find((err, response) => {
        console.log(response);
        if (err || response.length === 0) {
            console.log(response);
           res.render('organise', { department: [] ,error: true  ,mssg:"No Department Found" });
        }
        else {
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
            res.redirect("/voting") ;
        }
    })
   
})
// voting route
const votingCandidates = new Map() ; 
Router.get("/voting",(req,res)=>{ 
    //Get department from database 
    //Also get its coresponding candidates 
    
    Dept.find({selected:true},(err,dept)=>{ 
        console.log(dept) ;
        if(err||!dept) { 
            console.log("OK") ;
            res.render("voting" , {votingcandidates: votingCandidates, error : true ,msg :"No Poll Found" ,id:req.query.id}) ;
        }
        else { 
            console.log("else");
            dept.forEach((department)=>{ 
                Candidate.find({department:department.name},(err,candidates)=>{
                    if(err||!candidates){
                        // pair department with an empty list of candidates
                        votingCandidates.set(department.name,[]) ;
                    }
                    else { 
                        console.log("cadi" , candidates); 
                        votingCandidates.set(department.name,candidates) ;
                        console.log("im",votingCandidates);
                    } 
                }
                ) 
                })
                console.log(votingCandidates);   
          
            res.render('voting',{votingcandidates:votingCandidates,error:false,msg:'',id:req.query.id}) ;
        }
    })
       // res.render('voting')
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