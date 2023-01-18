"use strict";

const StudentStorage = require("./StudentStorage");


class Student {
    constructor(body){
        this.body=body;
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