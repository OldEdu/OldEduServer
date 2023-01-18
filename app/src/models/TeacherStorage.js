"use strict"

const db=require("../config/db");

class TeacherStorage{
      //phoneNumber로 회원 정보 가져오기
      static async getTeacherInfo(phoneNumber){
        return new Promise(async(resolve,reject)=>{
            try{
                const teacherRef =db.collection("teachers").doc(phoneNumber);
                const response = await teacherRef.get();
                resolve(response.data());
            }catch(err){
                reject(`${err}`)
            }

        })
       
    }
    //선생님 프로필 정보 저장하기 (닉네임, 프로필 정보, 프로필 사진)
    static async saveProfile(profileInfo){
        return new Promise(async(resolve,reject)=>{
            try{
                const phoneNumber=profileInfo.phoneNumber;
                const teacherRef=await db.collection("teachers").doc(phoneNumber)
                .update({
                    nickName:profileInfo.nickName,
                    profileDesc:profileInfo.profileDesc,
                    profilePicture:profileInfo.profilePicture,
                    //하트게시물
                })
                
                resolve({success:true});
            } catch(error){
                reject(`${error}`)
            }     
        })
    }


     //선생님 정보 저장하기
    static async save(teacherInfo){
        return new Promise(async(resolve,reject)=>{
            try{
                const phoneNumber=teacherInfo.phoneNumber;
                const TeacherJson={
                    phoneNumber:teacherInfo.phoneNumber,
                    nickName:teacherInfo.nickName,
                    psword:teacherInfo.psword,
                    isStudent:teacherInfo.isStudent,
                    //profileDesc:teacherInfo.profileDesc,
                    //profilePicture:teacherInfo.profilePicture,
                    //하트게시물
                };
                await db.collection("teachers").doc(phoneNumber).set(TeacherJson);
                resolve({success:true});
            } catch(error){
                reject(`${error}`)
            }     
        })
    }


}
module.exports=TeacherStorage;






