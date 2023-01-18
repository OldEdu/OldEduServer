"use strict";

const StudentStorage = require("./StudentStorage");


class Student {
    constructor(body){
        this.body=body;
    }
    //학습자 정보 갖고 오기
    async getStudent(){
        try{
            const client = this.body;
            const response = await StudentStorage.getStudentInfo(client);
            return response;
        }catch(err){
            return {success:false, err};
        }
    }
    async register(){
        const client = this.body;
        try{
            const response = await StudentStorage.save(client);
            return response;
        }catch(err){
            return {success : false, err};
        }
    }


}
module.exports=Student