"use strict";

const { resolve } = require("path");
const db = require("../config/db");

const {default: algoliasearch} = require("algoliasearch");
const client = algoliasearch(
    "PLWCCK93VC",
    "08de95a65adc4cc640393ce326e39f1a", algoliasearch,
);

const index = client.initIndex('edupost_search')


//PostStorage에서는 DB를 CRUD(생성,읽기,수정,삭제)역할
class PostStorage {

    //postID로 게시글 정보 갖고오기 
    static async getPostInfo(postID) {
        return new Promise(async (resolve, reject) => {
            try {
                const postRef = db.collection("eduPost").doc(postID);
                const post = await postRef.get();
        
                await db.collection("eduPost").doc(postID)
                .update({
                    views: ++(post.data().views), //게시글 조회수1 증가
                })
                const response = await postRef.get();

                resolve(response.data());
            } catch (err) {
                reject(`${err}`);
            }
        })
    }

    //userID로 내가 쓴 게시글 갖고오기
    static async getMyPosts(userID) {
        return new Promise(async (resolve, reject) => {
            try {
                var result = [];
                var residx = 0;
                const postRef = db.collection("eduPost")
                var queryRef = await postRef.where("userID", "==", userID).get();

                if (queryRef.empty) {
                    resolve({ success: true, msg: "No posts have been created." }); //작성된 게시글이 없습니다.
                }
                queryRef.forEach(doc => {
                    result[residx++] = doc.data();
                })

                result=recentSort(result); //최신순 정렬


                resolve({ success: true, result });
            } catch (err) {
                reject(`${err}`);
            }
        })
    }



    //게시글 등록하기
    static async savePost(postInfo) {
        return new Promise(async (resolve, reject) => {
            try {
                const TIME_ZONE = 3240 * 10000; //한국과 시차 맞추기
                const date = new Date();
                const in_date = new Date(+date + TIME_ZONE).toISOString().replace('T', ' ').replace(/\..*/, ''); //게시글 등록 시 날짜 및 시간
                // userName 가져오기
                const userRef = db.collection("users").doc(postInfo.userID);
                const user = await userRef.get();
                const userName = user.data().userName;
                const postJson = {                    //게시글 정보 
                    title: postInfo.title,
                    category: postInfo.category,
                    in_date: in_date,
                    views: 0,            //조회수,하트,스크랩,신고수 0회로 초기 셋팅
                    heart: 0,
                    declaration: 0,
                    scrap:0,
                    comment:0,
                    userID: postInfo.userID,
                    userName: userName,
                }
                const postRef = await db.collection("eduPost").add(postJson);
                await db.collection("eduPost").doc(postRef.id)
                    .update({
                        postID: postRef.id, //필드에 postID추가
                    })
                resolve({ success: true , postID:postRef.id});
            } catch (err) {
                reject(`${err}`);
            }
        })
    }
    //postID를 받아 게시글 수정하기(title,category)
    static async updatePost(postInfo) {
        return new Promise(async (resolve, reject) => {
            try {
                //title,category만 수정가능
                const postRef = await db.collection("eduPost").doc(postInfo.postID)
                    .update({
                        title: postInfo.title,
                        category: postInfo.category,
                    })
                resolve({ success: true });
            } catch (err) {
                reject(`${err}`);
            }
        })
    }

    //postID를 받아 게시글 삭제하기
    static async deletePost(postId) {
        return new Promise(async (resolve, reject) => {
            try {
                await db.collection("eduPost").doc(postId).delete();
                resolve({ success: true });
            } catch (err) {
                reject(`${err}`);
            }
        })
    }

    //category에 맞는 게시글 불러오기 (하트수 정렬)
    static async getHeartPosts(categoryName) {
        return new Promise(async (resolve, reject) => {
            try {
                var result = [];
                result = await getPosts(categoryName);

                if(result.length==0){
                    resolve({ success: true, msg: `${categoryName} 카테고리에 생성된 게시물이 없습니다.` }); //생성된 게시물이 없습니다.
                }
                
                result=recentSort(result); //최신순 정렬

                result.sort(function (a, b) { //하트 내림차순 정렬 
                    return b.heart - a.heart;
                })
                resolve({ success: true, result });
            } catch (err) {
                reject(`${err}`);
            }
        })
    }
    //category에 맞는 게시글 불러오기 (조회수 정렬)
    static async getViewsPosts(categoryName) {
        return new Promise(async (resolve, reject) => {
            try {
                var result = [];
                result = await getPosts(categoryName);
                
                if(result.length==0){
                    resolve({ success: true, msg: `${categoryName} 카테고리에 생성된 게시물이 없습니다.` }); //생성된 게시물이 없습니다.
                }

                result=recentSort(result); //최신순 정렬

                result.sort(function (a, b) { //조회수 내림차순 정렬 
                    return b.views - a.views;
                })
                resolve({ success: true, result });
            } catch (err) {
                reject(`${err}`);
            }
        })
    }


    //category에 맞는 게시글 불러오기 (최신 정렬순)
    static async getRecentPosts(categoryName) {
        return new Promise(async (resolve, reject) => {
            try {
                var result = [];
                
                result = await getPosts(categoryName);
                
                if(result.length==0){
                    resolve({ success: true, msg: `${categoryName} 카테고리에 생성된 게시물이 없습니다.` }); //생성된 게시물이 없습니다.
                }
                
                result=recentSort(result); //최신순 정렬

                resolve({ success: true, result });
            } catch (err) {
                reject(`${err}`);
            }
        })
    }

    //게시글 검색 (최신 정렬순)
    static async getSearchRecentPosts(categoryName, keyword) { //검색 키워드가 매게변수이다.
        return new Promise(async (resolve, reject) => {
            try {
        
                let algoliasearch=[]
                let result=[]
                let idx=0
               
                //algolia 검색
                await index
                .search(keyword)
                .then(({hits})=>{
                algoliasearch = hits});

                //algolia에서 가져온 검색결과의 objectID를 fireStorage에서 postID로 찾음
                var postRef = await db.collection("eduPost");
                
                for (const searchRes of algoliasearch) {
                    if(searchRes.category == categoryName){
                        var eduPostRef = postRef.doc(searchRes.objectID);
                        var eduPost= (await eduPostRef.get())
                        result[idx++]= await eduPost.data()
                    }
                }

                if (result.length==0) {
                    resolve({ success: true, msg: `${keyword}와(과) 일치하는 검색결과가 없습니다.` }); //검색된 게시물이 없습니다.
                }                

                resolve({ success: true, result });
            } catch (err) {
                reject(`${err}`);
            }
        })
    }
    //게시글 검색 (하트 정렬순)
    static async getSearchHeartPosts(categoryName, keyword) { //검색 키워드가 매게변수이다.
        return new Promise(async (resolve, reject) => {
            try {
                let result = await getSearchPosts(categoryName,keyword);

                if (result.length==0) {
                    resolve({ success: true, msg: `${keyword}와(과) 일치하는 검색결과가 없습니다.` }); //검색된 게시물이 없습니다.
                }

                result=recentSort(result); //최신순 정렬

                result.sort(function (a, b) { //하트 내림차순 정렬 
                    return b.heart - a.heart;
                })

                resolve({ success: true, result });

            } catch (err) {
                reject(`${err}`);
            }
        })
    }
    //게시글 검색 (조회수 정렬순) 
    static async getSearchViewsPosts(categoryName, keyword) { //검색 키워드가 매게변수이다.
        return new Promise(async (resolve, reject) => {
            try {

                let result = await getSearchPosts(categoryName,keyword);

                if (result.length==0) {
                    resolve({ success: true, msg: `${keyword}와(과) 일치하는 검색결과가 없습니다.` }); //검색된 게시물이 없습니다.
                }
                
                result=recentSort(result); //최신순 정렬

                result.sort(function (a, b) { //조회수 내림차순 정렬 
                    return b.views - a.views;
                })

                resolve({ success: true, result });

            } catch (err) {
                reject(`${err}`);
            }
        })
    }
    // 학습자가 해당 heart를 클릭 했는지 확인하기 위한
    static async checkHeartOn(heartInfo){
        return new Promise(async (resolve, reject) => {
            try{
                const heartRef = await db.collection("heart").where("postID", "==", heartInfo.postID).get();
                heartRef.forEach((heart) => {
                    // 아래의 조건문에 걸리면 해당 학습자가 해당 게시글에 heart를 누른 것
                    if(heart.data().userID === heartInfo.userID){
                        resolve(true);
                    }
                });
                // 그대로 루프를 빠져나오면 하트를 클릭 안했다는 것
                resolve(false);
            }catch(err){
                reject(`${err}`);
            }
        })
    }
    // 게시글,게시글 작성한 교육자 하트수 올리기
    static async updatePostHeart(heartInfo){
        return new Promise(async (resolve, reject) => {
            try {
                // *** heartDB에 저장 *** //
                const heartJson = {                   
                    postID: heartInfo.postID,
                    userID: heartInfo.userID,
                }
                const heartRef = await db.collection("heart").add(heartJson);
                await db.collection("heart").doc(heartRef.id)
                .update({
                    heartID: heartRef.id,
                })
                // eduPost DB에 하트수 올리기
                var postRef = db.collection("eduPost").doc(heartInfo.postID);
                const post = await postRef.get();

                await db.collection("eduPost").doc(heartInfo.postID)
                .update({
                    heart: ++(post.data().heart), //게시글 하트수 1개 증가  
                })
                const response = await postRef.get();
                
                var userID = post.data().userID;
                var teacherstRef= db.collection("teachers").doc(userID);

                const teacher = await teacherstRef.get();
                await teacherstRef
                .update({
                    heart:++(teacher.data().heart), //선생님 하트수 1개 증가
                })

                resolve({success:true, heartID:heartRef.id,heart:++(post.data().heart)}); //하트 수 1증가 된 게시글 리턴
                
            } catch (err) {
                reject(`${err}`);
            }
        })
    }
    
    // 하트 감소하기
    static async reducePostHeart(heartID){
        return new Promise(async (resolve, reject) => {
            try{
                const heartRef = db.collection("heart").doc(heartID);
                const heart = await heartRef.get();

                const postID = heart.data().postID;
                const postRef = db.collection("eduPost").doc(postID);
                const post = await postRef.get();
                const heartCount = post.data().heart;
                // eduPost의 scrap이 0 이하인 경우에는 -1을하지 못하도록 함
                if (heartCount > 0) {
                    await db.collection("eduPost").doc(postID)
                    .update({
                        heart: --(post.data().heart),
                    })
                }
                await db.collection("heart").doc(heartID).delete();
                resolve({success:true,heartID:null,heart:--(post.data().heart)});
            }catch(err){
                reject(`${err}`);
            }
        })
    }

    // 해당 학습자가 해당 게시글에 하트/스크랩 했는지 확인
    static async returnViewHeart(postInfo){
        return new Promise(async(resolve, reject)=>{
            try{
                const heartRef = await db.collection("heart").where("postID", "==", postInfo.postID).get();
                const scrapRef = await db.collection("scrap").where("postID", "==", postInfo.postID).get();
                heartRef.forEach((heart) => {
                    // 아래의 조건문에 걸리면 heart가 ture
                    if(heart.data().userID === postInfo.userID){
                        scrapRef.forEach((scrap) => {
                            // heart = true, scrap = true
                            if(scrap.data().userID === postInfo.userID){
                                resolve({heartID:heart.data().heartID,heartOnClicked:true,scrapID:scrap.data().scrapID,scrapOnClicked:true});
                            }
                        })
                        //해당 if문 안에는 존재하지만 scrap루프는 빠져나왔으므로 heart = true, scrap = false
                        resolve({heartID:heart.data().heartID,heartOnClicked:true,scrapID:null,scrapOnClicked:false});
                    }
                });
                // heart = false인 경우는 루프 탈출이므로
                scrapRef.forEach((scrap) => {
                    if(scrap.data().userID === postInfo.userID){
                        resolve({heartID:null,heartOnClicked:false,scrapID:scrap.data().scrapID,scrapOnClicked:true});
                    }
                })
                // 어떤 조건문(if문)에도 걸리지 않으면 전부 false
                
                resolve({heartID:null,heartOnClicked:false,scrapID:null,scrapOnClicked:false});
            }catch(err){
                reject(`${err}`);
            }
        })
    }
}
//배열을 최신순으로 정렬해주는 함수
function recentSort(array){
    array.sort(function (a, b) {//최신순 정렬
        if (b.in_date > a.in_date) return 1;
        else if (b.in_date < a.in_date) return -1;
        else return 0;
    })
    return array;
}

async function getSearchPosts(objectID) {

    var postRef = db.collection("eduPost");
    var eduPostRef = postRef.doc(objectID);
    var eduPost= (await eduPostRef.get())
    
    console.log(eduPost.data())
    return eduPost.data();
}
async function getPosts(categoryName) {
    var result = [];
    var residx = 0;
    var categoryRef = await db.collection("eduPost").where("category", "==", categoryName).get();

    categoryRef.forEach(doc => {  //데이터 갖고오기   
        result[residx++] = doc.data();
    })
    return result;
}


module.exports = PostStorage