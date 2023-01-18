"use strict"

const db=require("../config/db");

class StudentStroage{

    
      //userID로 학습자 정보 가져오기
      static async getStudentInfo(userID){
        return new Promise(async(resolve,reject)=>{
            try{
                const studentRef = db.collection("students").doc(userID);
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
                const userID=studentInfo.userID;
                const StudentJson={
                    userID:studentInfo.userID,
                    userName:studentInfo.userName,
                    psword:studentInfo.psword,
                    userType:studentInfo.userType,
                    //스크랩 게시물
                };
                await db.collection("students").doc(userID).set(StudentJson);
                resolve({success:true});
            } catch(error){
                reject(`${err}`)
            }     
        })
    }


}
module.exports=StudentStroage;
