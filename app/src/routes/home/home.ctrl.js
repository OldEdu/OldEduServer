"use strict"
const db=require("../../config/db");
const User=require("../../models/User");
const Teacher=require("../../models/Teacher");
const Student = require("../../models/Student");
const Scrap = require("../../models/Scrap");
const { response } = require("express");

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

    profile:async(req,res)=>{
        try{
            var userType = await new User(req.body).getUserType(req.params.userID);
            if(userType ===true){ //학습자인 경우 => 학습자 정보 불러오기
                const student =new Student(req.params.userID);
                const response = await student.getStudent();
                res.send(response);
            }
            else { //교육자 정보 불러오기
                const teacher = new Teacher(req.params.userID);
                const response = await teacher.getTeacher();
                res.send(response);
            } 
        }catch(error){
            res.send(error)
        }
    },

    scrap:async(req,res)=>{
        const scrap = new Scrap(req.params.userID);
        const response = await scrap.getScrapList(scrap.userID);
        res.send(response);
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
        const teacher= new Teacher(req.body);
        const response=await teacher.updateProfile();
        return res.json(response);
    },
    scrap:async(req,res)=>{        
        const userType = await new Scrap(req.body).getUserType(req.params.userID);
        if(userType === true) {
            const scrap = new Scrap(req.body);
            const response = await scrap.addScrap();
            return res.json(response);
        }
        else{
            const response = {success:false , msg: "You are not Sutudent."};
            return res.json(response);
        }
    }
};

module.exports={
    output,
    process,
};