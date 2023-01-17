"use strict"

const db=require("../config/db");

/*
User Stroage에서는 DB를 CRUD(생성,읽기,수정,삭제)역할
*/


class UserStorage{

    //phoneNumber로 회원 정보 가져오기
    static async getUserInfo(phoneNumber){
        try{
            const userRef =db.collection("users").doc(req.params.phoneNumber);
            const response = await userRef.get();
            res.send(response.data());
        }catch(err){
            res.send(err);
        }
    }

     //회원 정보 저장하기
    static async save(userInfo){
        return new Promise(async(resolve,reject)=>{
            try{
            const phoneNumber=userInfo.phoneNumber;
            const userJson={
                phoneNumber:userInfo.phoneNumber,
                nickName:userInfo.nickName,
                psword:userInfo.psword
            };
            await db.collection("users").doc(phoneNumber).set(userJson);
            resolve({success:true});
        } catch(error){
            reject(`${err}`)
        }     
        })
    }
    
    
}
module.exports=UserStorage;