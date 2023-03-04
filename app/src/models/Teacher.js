"use strict";

const TeacherStorage = require("./TeacherStorage");

class Teacher {
    constructor(body){
        this.body=body;
    }
    //교육자 정보 갖고 오기
    async getTeacher(){
        try{
            const client = this.body;
            const response = await TeacherStorage.getTeacherInfo(client);
            return response;
        }catch(err){
            return {success:false, err};
        }
    }
    
    //교육자 회원가입 
    async register(){
        const client = this.body;
        try{
            const response = await TeacherStorage.save(client);
            return response;
        }catch(err){
            return {success : false, err};
        }
    }
    //교육자 프로필 수정하기
    async updateProfile(){
        const client = this.body;
        try{
            const response = await TeacherStorage.saveProfile(client);
            return response;
        }catch(err){
            return {success : false, err};
        }
    }


}


module.exports=Teacher