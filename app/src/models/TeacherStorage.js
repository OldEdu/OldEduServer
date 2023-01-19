"use strict"

const db=require("../config/db");

class TeacherStorage{
      //userID로 교육자 정보 가져오기
      static async getTeacherInfo(userID){
        return new Promise(async(resolve,reject)=>{
            try{
                const teacherRef =  db.collection("teachers").doc(userID);
                const response = await teacherRef.get();
                resolve(response.data());
            }catch(err){
                reject(`${err}`)
            }

        })
    }

     //교육자 정보 저장하기
     static async save(teacherInfo){
        return new Promise(async(resolve,reject)=>{
            try{
                const userID=teacherInfo.userID;
                const TeacherJson={
                    userID:teacherInfo.userID,
                    userName:teacherInfo.userName,
                    psword:teacherInfo.psword,
                    userType:teacherInfo.userType,
                    //profileDesc:teacherInfo.profileDesc,
                    //profilePicture:teacherInfo.profilePicture,
                    heart:0
                };
                await db.collection("teachers").doc(userID).set(TeacherJson);
                resolve({success:true});
            } catch(error){
                reject(`${error}`)
            }     
        })
    }


    //교육자 프로필 정보 저장하기 (닉네임, 프로필 정보, 프로필 사진)
    static async saveProfile(profileInfo){
        return new Promise(async(resolve,reject)=>{
            try{
                const userID=profileInfo.userID;
                await db.collection("teachers").doc(userID)
                .update({
                    userName:profileInfo.userName,
                    profileDesc:profileInfo.profileDesc,
                    profilePicture:profileInfo.profilePicture,
                    
                })
                
                resolve({success:true});
            } catch(error){
                reject(`${error}`)
            }     
        })
    }




}
module.exports=TeacherStorage;






