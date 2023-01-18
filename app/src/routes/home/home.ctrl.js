"use strict"

const User=require("../../models/User");
const Teacher=require("../../models/Teacher");

const output={
    home : (req,res)=>{
        res.render("home/index");
    },
    login : (req,res)=>{
        res.render("home/login");
    },
    register:(req,res)=>{
        res.render("home/register");
    },
    profile:(req,res)=>{
        res.render("home/profile/:phoneNumber")
    }
}

const process={
    login:async (req,res)=>{
        const user= new User(req.body);
        const response=await user.login();
        return res.json(response);
    },
    register:async (req,res)=>{
        const user= new User(req.body);
        const response=await user.register();
        return res.json(response);
    },
    profile:async (req,res)=>{
        console.log(res);
        const teacher= new Teacher(req.body);
        const response=await teacher.updateProfile();
        return res.json(response);
    }
};

module.exports={
    output,
    process,
};