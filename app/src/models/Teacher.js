"use strict";

const TeacherStorage = require("./TeacherStorage");

class Teacher {
    constructor(body){
        this.body=body;
    }
    async register(){
        const client = this.body;
        try{
            const response = await TeacherStorage.save(client);
            return response;
        }catch(err){
            return {success : false, err};
        }
    }

    async updateProfile(){
        const client = this.body;
        console.log(client);
        try{
            const response = await TeacherStorage.saveProfile(client);
            return response;
        }catch(err){
            return {success : false, err};
        }
    }


}


module.exports=Teacher