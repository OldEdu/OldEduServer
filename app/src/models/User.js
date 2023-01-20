"use strict";
/*
User은 유저 데이터를 가지고 검증 및 조작하는 역할
*/

const UserStorage =require("./UserStorage");

class User{
    constructor(body){
        this.body=body;
    }
    //userID로 유저 타입 가져오기
    async getUserType(userID){
        try{
            const response = await UserStorage.getType(userID);
            return response;
        }catch(err){
            return {success:false, err};
        }
    }
    //로그인 기능
    async login(){
        const client =this.body;
        try{
            const user = await UserStorage.getUserInfo(client);
            if(user){
                if(user.userID === client.userID && user.psword ===client.psword){
                    return {success :true};
                }
                return {success:false ,msg:"비밀번호가 틀렸습니다."}; 
            }
            return {success:false,msg:"존재하지 않는 아이디 입니다."};
        }catch(err){ 
            return {success:false,err};
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