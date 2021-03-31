const { response } = require('express');
const express = require('express') ;
const Candidate = require("../Models/candidate");
const Router = express.Router();
const Dept = require('../Models/department');
Router.get('/',(req,res)=>{
    res.render('adddept' ,{error:''});
})
//register routes
Router.get('/register',((req,res)=>{ 
res.render('register') ;
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
        Candidate.findOne({ name: req.body.name }, (err, response) => {
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

module.exports = Router ;