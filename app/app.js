const express = require("express");
const bodyParser =require("body-parser");
const app = express();

const db=require("./src/config/db");
//라우팅
const home =require("./src/routes/home");

// 앱 셋팅
app.set("views","./src/views");
app.set("view engine","ejs");

app.use(express.static(`${__dirname}/src/public`));
app.use(express.json());
app.use(bodyParser.json());
//URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결
app.use(bodyParser.urlencoded({extended:true}));

app.use("/",home);

module.exports =app;



// app.post('/create', async(req,res)=>{
//     try{
//         console.log(req.body);
//         const phoneNumber =req.body.phoneNumber;
//         const userJson={
//             phoneNumber: req.body.phoneNumber,
//             nickName:req.body.nickName,
//             psword:req.body.psword
//         };
//         const response =await db.collection("users").doc(phoneNumber).set(userJson);
//         res.send(response);
//     }catch(error){
//         res.send(error);
//     };
// })

// app.get('/read/all',async(req,res)=>{
//     try{
//         const usersRef =db.collection("users");
//         const response =await usersRef.get();
//         let responseArr = [];
//         response.forEach(doc=>{
//             responseArr.push(doc.data());
//         });
//         res.send(responseArr);
//     }catch(error){
//         res.send(error)
//     }
// })

// app.get('/read/:phoneNumber',async(req,res)=>{
//     try{
//         const userRef =db.collection("users").doc(req.params.phoneNumber);
//         const response =await userRef.get();
//         res.send(response.data());
//     }catch(error){
//         res.send(error)
//     }
// });

// app.post('/update',async(req,res)=>{
//     try{
//         const phoneNumber=req.body.phoneNumber;
//         const newnickName=req.body.nickName;
//         const userRef =await db.collection("users").doc(phoneNumber)
//         .update({
//             nickName:newnickName
//         })
//         res.send(response);
//     }catch(error){
//         res.send(error);
//     }
// })

// app.delete('/delete/:phoneNumber',async(req,res)=>{
//     try{
//         console.log(res);
//         const response =await db.collection("users").doc(req.params.phoneNumber).delete();
//         res.send(response);
//     }catch(error){
//         res.send(error);
//     }
// })

