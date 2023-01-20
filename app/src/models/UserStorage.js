"use strict"

const db=require("../config/db");
const Teacher=require("./Teacher");
const Student=require("./Student");
/*
UserStroage에서는 DB를 CRUD(생성,읽기,수정,삭제)역할
*/


class UserStorage{

    //user 정보 갖고오기
    static async getUserInfo(userInfo){
        return new Promise(async(resolve,reject)=>{
            try{
                const userRef =db.collection("users").doc(userInfo.userID);
                const response = await userRef.get();
                resolve(response.data());
            }catch(err){
                reject(`${err}`)
            }

        })
       
    }

    //user 타입(학습자, 교육자) 정보 갖고오기
    static async getType(userID){
        return new Promise(async(resolve,reject)=>{
            try{
                const userRef =db.collection("users").doc(userID);
                const response = await userRef.get();
                resolve(response.data().userType);
            }catch(err){
                reject(`${err}`)
            }

        })
       
    }


     //회원 정보 저장하기
    static async save(userInfo){
        return new Promise(async(resolve,reject)=>{
        try{
            const userType=userInfo.userType
            const userID=userInfo.userID;
            const userJson={
                userID:userInfo.userID,
                userName:userInfo.userName,
                psword:userInfo.psword,
                userType:userInfo.userType
            };
            await db.collection("users").doc(userID).set(userJson);
            if(userType===true){  //학습자인 경우 회원가입
                const student= new Student(userInfo);
                student.register();
            }    
            else{ //교육자인 경우 회원가입
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