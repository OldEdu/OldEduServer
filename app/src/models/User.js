"use strict";
/*
Usesr은 해당 데이터를 가지고 검증 및 조작하는 역할
*/

const UserStorage =require("./UserStorage");

class User{
    constructor(body){
        this.body=body;
    }
    //phoneNumber로 유저 타입 가져오기
    async getUserType(phoneNumber){
        try{
            const response = await UserStorage.getType(phoneNumber);
            return response;
        }catch(err){
            return {success:false, err};
        }
    }
    //로그인 기능
    async login(){
        const client =this.body
        try{
            const {phoneNumber, psword} = await UserStorage.getUserInfo(client.phoneNumber);
            if(phoneNumber){
                if(phoneNumber === client.phoneNumber && psword ===client.psword){
                    return {success :true};
                }
                return {success:false ,msg:"비밀번호가 틀렸습니다."}; 
            }
        }catch(err){ //폰번호를 db에 존재하지 않을 경우 err
            return {success:false,msg:"존재하지 않는 아이디 입니다."};
        }
    }
    //회원가입 기능
    async register(){
        const client =this.body;
        try{
            const response =await UserStorage.save(client);
            return response;
        }catch(err){
            return {success: false, err};
        }
    }
}
module.exports=User