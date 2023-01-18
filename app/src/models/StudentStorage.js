"use strict"

const db=require("../config/db");

class StudentStroage{

    
      //phoneNumber로 학습자 정보 가져오기
      static async getStudentInfo(phoneNumber){
        return new Promise(async(resolve,reject)=>{
            try{
                const studentRef = db.collection("students").doc(phoneNumber);
                const response = await studentRef.get();
                resolve(response.data());
            }catch(err){
                reject(`${err}`)
            }

        })
       
    }

     //학습자 정보 저장하기
    static async save(studentInfo){
        return new Promise(async(resolve,reject)=>{
            try{
                const phoneNumber=studentInfo.phoneNumber;
                const StudentJson={
                    phoneNumber:studentInfo.phoneNumber,
                    nickName:studentInfo.nickName,
                    psword:studentInfo.psword,
                    isStudent:studentInfo.isStudent,
                    //스크랩 게시물
                };
                await db.collection("students").doc(phoneNumber).set(StudentJson);
                console.log("student save");
                resolve({success:true});
            } catch(error){
                reject(`${err}`)
            }     
        })
    }


}
module.exports=StudentStroage;
