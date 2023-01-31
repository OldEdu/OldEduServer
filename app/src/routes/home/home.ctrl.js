"use strict"
const db=require("../../config/db");
const User=require("../../models/User");
const Teacher=require("../../models/Teacher");
const Student = require("../../models/Student");
const Post =require("../../models/Post");

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
    myPost:async(req,res)=>{
        const posts= new Post(req.params.userID);
        const response =await posts.readMyPostAll();
        res.send(response);
    },
    post:async(req,res)=>{
        const posts=new Post(req.params.postID);
        const response =await posts.readPost();
        res.send(response);
    },
    recentPosts:async(req,res)=>{
        const posts=new Post();
        const response = await posts.readPostAll();
        res.send(response);

    },
    heartPosts:async(req,res)=>{
        const posts=new Post();
        const response = await posts.readHeartPostAll();
        res.send(response);

    },
    viewsPosts:async(req,res)=>{
        const posts=new Post();
        const response = await posts.readViewsPostAll();
        res.send(response);

    },
    searchPosts:async(req,res)=>{
        const posts=new Post();
        const response = await posts.readSearchPostAll(req.query.keyword);
        res.send(response);

    },
    searchHeartPosts:async(req,res)=>{
        const posts=new Post();
        const response = await posts.readSearchHeartPostAll(req.query.keyword);
        res.send(response);

    },


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
    createPost:async(req,res)=>{
        const post = new Post(req.body);
        const response = await post.createPost();
        return res.json(response);
    }

};

module.exports={
    output,
    process,
};