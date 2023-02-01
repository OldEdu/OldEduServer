"use strict";

const db= require("../config/db");
//PostStorage에서는 DB를 CRUD(생성,읽기,수정,삭제)역할
class PostStorage{
    
    //postID로 게시글 정보 갖고오기 
    static async getPostInfo(postID){
        return new Promise(async(resolve, reject)=>{
            try{
                const postRef = db.collection("eduPost").doc(postID);
                const response =await postRef.get();
                resolve(response.data());
            }catch(err){
                reject(`${err}`);
            }
        })
    }

    //userID로 내가 쓴 게시글 갖고오기
    static async getPosts(userID){
        return new Promise(async(resolve,reject)=>{
            try{
                var result=[];
                var residx=0;
                const postRef = db.collection("eduPost")
                var queryRef =await postRef.where("userID","==",userID).get();
            
                 if(queryRef.empty){
                    resolve({success:true , msg: "No posts have been created."}); //작성된 게시글이 없습니다.
                }
                queryRef.forEach(doc=>{
                    result[residx++]=doc.data();
                })
                resolve({success:true, result});
            }catch(err){
                reject(`${err}`);
            }
        })
    }



    //게시글 등록하기
    static async savePost(postInfo){
        return new Promise(async(resolve, reject)=>{
            try{
                const in_date=new Date().toLocaleString(); //게시글 등록 시 날짜 및 시간
                const postJson={                    //게시글 정보 
                    title:postInfo.title,
                    category:postInfo.category,
                    in_date:in_date,
                    views:0,            //조회수,하트,신고수 0회로 초기 셋팅
                    heart:0,
                    declaration:0,
                    userID:postInfo.userID,
                }
                const postRef= await db.collection("eduPost").add(postJson);
                await db.collection("eduPost").doc(postRef.id)
                .update({
                    postID:postRef.id, //필드에 postID추가
                })
                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }
        })
    }
    //postID를 받아 게시글 수정하기(title,category)
    static async updatePost(postInfo){
        return new Promise(async(resolve,reject)=>{
            try{    
                //title,category만 수정가능
                const postRef=await db.collection("eduPost").doc(postInfo.postID)
                .update({
                    title:postInfo.title,
                    category:postInfo.category,
                })
                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }
        })
    }

    //게시글 삭제하기
    //postID를 받아 게시글 삭제하기
    static async deletePost(postId){
        return new Promise(async(resolve,reject)=>{
            try{
                await db.collection("eduPost").doc(postId).delete();
                resolve({success:true});
            }catch(err){
                reject(`${err}`);
            }
        })
    }

    //최신 게시글 불러오기
    static async getRecentPosts(){
        return new Promise(async(resolve, reject)=>{
            try{
                var result=[];
                var residx=0;
                const postRef = db.collection("eduPost");
                var queryRef =await postRef.orderBy('in_date','desc').get();//내림차순
                
                if(queryRef.empty){
                    resolve({success:true , msg: "No posts have been created."}); //작성된 게시글이 없습니다.
                }

                queryRef.forEach(doc=>{
                    result[residx++]=doc.data();
                })
                resolve({success:true, result});
            }catch(err){
                reject(`${err}`);
            }
        })
    }
    //하트가 가장 많은 게시글 불러오기
    static async getHeartPosts(){
        return new Promise(async(resolve, reject)=>{
            try{
                var result=[];
                var residx=0;
                const postRef = db.collection("eduPost");
                var queryRef =await postRef.orderBy('heart','desc').get(); //내림차순
                
                if(queryRef.empty){
                    resolve({success:true , msg: "No posts have been created."}); //작성된 게시글이 없습니다.
                }
                queryRef.forEach(doc=>{
                    result[residx++]=doc.data();
                })
                resolve({success:true, result});
            }catch(err){
                reject(`${err}`);
            }
        })
    }
    //조회수가 가장 많은 게시글 불러오기
    static async getViewsPosts(){
        return new Promise(async(resolve, reject)=>{
            try{
                var result=[];
                var residx=0;
                const postRef = db.collection("eduPost");
                var queryRef =await postRef.orderBy('views','desc').get(); // 내림차순
                if(queryRef.empty){
                    resolve({success:true , msg: "No posts have been created."}); //작성된 게시글이 없습니다.
                }
                queryRef.forEach(doc=>{
                    result[residx++]=doc.data();
                })
                resolve({success:true, result});
            }catch(err){
                reject(`${err}`);
            }
        })
    }
    
    //게시글 검색 (최신 정렬순)
    static async getSearchRecentPosts(keyword){ //검색 키워드가 매게변수이다.
        return new Promise(async(resolve,reject)=>{
            try{
                var result=[];
                var residx=0;
                const postRef =  db.collection("eduPost");
                var searchRef= await postRef.orderBy("title").startAt(keyword).endAt(keyword+'\uf8ff').get();
                //var searchRef = await postRef.orderBy("title").startAt(keyword).endAt(keyword+'\uf8ff').get();       
    
                if(searchRef.empty){
                    resolve({success:true , msg: "검색된 게시물이 없습니다."}); //검색된 게시물이 없습니다.
                }
             
                searchRef.docs.slice().reverse().forEach(doc=>{          //검색된 게시글 최신순정렬
                    result[residx++]=doc.data();
                })

                resolve({success:true, result});
            }catch(err){
                reject(`${err}`);
            }
        })
    }
    //게시글 검색 (하트 정렬순)
    static async getSearchHeartPosts(keyword){ //검색 키워드가 매게변수이다.
        return new Promise(async(resolve,reject)=>{
            try{
                var result=[];
                var residx=0;
                const postRef =  db.collection("eduPost");
                var searchRef= await postRef.orderBy("title").startAt(keyword).endAt(keyword+'\uf8ff').get(); //검색
    
                if(searchRef.empty){
                    resolve({success:true , msg: "검색된 게시물이 없습니다."}); //검색된 게시글이 없습니다.
                }
                searchRef.docs.slice().reverse().forEach(doc=>{          //검색된 게시글 최신순정렬
                    result[residx++]=doc.data();
                })

                result.sort(function(a,b){ //하트 내림차순 정렬 
                    return b.heart-a.heart;
                })
                
                resolve({success:true, result});
            
            }catch(err){
                reject(`${err}`);
            }
        })
    }
    //게시글 검색 (조회수 정렬순) 
    static async getSearchViewsPosts(keyword){ //검색 키워드가 매게변수이다.
        return new Promise(async(resolve,reject)=>{
            try{
                var result=[];
                var residx=0;
                const postRef =  db.collection("eduPost");
                var searchRef= await postRef.orderBy("title").startAt(keyword).endAt(keyword+'\uf8ff').get(); //검색
    
                if(searchRef.empty){
                    resolve({success:true , msg: "검색된 게시물이 없습니다."}); //검색된 게시글이 없습니다.
                }
                searchRef.docs.slice().reverse().forEach(doc=>{          //검색된 게시글 최신순정렬
                    result[residx++]=doc.data();
                })

                result.sort(function(a,b){ //조회수 내림차순 정렬 
                    return b.views-a.views;
                })
                
                resolve({success:true, result});
            
            }catch(err){
                reject(`${err}`);
            }
        })
    }


}

//알파벳 판별을 위한 함수
function isAlphaOrParen(str) {
    return /^[a-zA-Z()]+$/.test(str);
  }
module.exports=PostStorage