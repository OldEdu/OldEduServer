"use strict"

const db=require("../config/db");
const Teacher=require("./Teacher");
const Student=require("./Student");
/*
User Stroage에서는 DB를 CRUD(생성,읽기,수정,삭제)역할
*/


class UserStorage{

    //phoneNumber로 회원 정보 가져오기
    static async getUserInfo(phoneNumber){
        return new Promise(async(resolve,reject)=>{
            try{
                const userRef =db.collection("users").doc(phoneNumber);
                const response = await userRef.get();
                resolve(response.data());
            }catch(err){
                reject(`${err}`)
            }

        })
       
    }

     //회원 정보 저장하기
    static async save(userInfo){
        return new Promise(async(resolve,reject)=>{
        try{
            const isStudent=userInfo.isStudent
            const phoneNumber=userInfo.phoneNumber;
            const userJson={
                phoneNumber:userInfo.phoneNumber,
                nickName:userInfo.nickName,
                psword:userInfo.psword,
                isStudent:userInfo.isStudent
            };
            await db.collection("users").doc(phoneNumber).set(userJson);
            if(isStudent==="true"){
                console.log(isStudent);
                const student= new Student(userInfo);
                student.register();
            }    
            else{
                console.log(isStudent);
                const teacher= new Teacher(userInfo);
                teacher.register();
            }
            resolve({success:true});
        
        } catch(err){
            reject(`${err}`)
        }     
        })
    }
    
    
}
module.exports=UserStorage;