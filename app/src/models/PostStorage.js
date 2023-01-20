"use strict";

const db= require("../config/db");
//PostStorage에서는 DB를 CRUD(생성,읽기,수정,삭제)역할
class PostStorage{
    
    //postID로 게시글 정보 갖고오기 
    static async getPostInfo(postInfo){
        return new Promise(async(resolve, reject)=>{
            try{
                const postRef = db.collection("eduPost").doc(postInfo.postID);
                const response =await postRef.get();
                resolve(response.data());
            }catch(err){
                reject(`${err}`);
            }
        })
    }

    // //userID로 내가 쓴 게시글 갖고오기
    // static async getPosts(userID){
    //     return new Promise(async(resolve,reject)=>{
    //         try{
    //             const postRef = db.collection("eduPost")
    //             var posts = postRef.orderByChild("userID").equalTo(userID);
    //             posts.once('value',function(data){
    //                 console.log(data.val());
    //             })
    //         }
    //     })
    // }



    //게시글 등록하기
    static async save(postInfo){
        return new Promise(async(resolve, reject)=>{
            try{
                const in_date=new Date().toLocaleString(); //게시글 등록 시 날짜 및 시간
                const postJson={
                    title:postInfo.title,
                    category:postInfo.category,
                    in_date:in_date,
                    views:0,
                    heart:0,
                    declaration:0,
                    userID:postInfo.userID,
                }
                await db.collection("eduPost").add(postJson);
                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }
        })
    }
}
module.exports=PostStorage