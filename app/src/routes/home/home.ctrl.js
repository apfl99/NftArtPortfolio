// 컨트롤러 모듈화
"use strict";

const User = require("../../models/User");

const fs = require('fs'); // js 파일 시스템 모듈을 사용하면 컴퓨터의 파일 시스템으로 작업할 수 있습니다. 
//multer 사용
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' }) //업로드

//ipfs-api 사용
var ipfsAPI = require('ipfs-api');
const { path } = require('express/lib/application');

// connect to ipfs daemon API server
var ipfs = ipfsAPI('infura-ipfs.io', '5001', {protocol: 'https'}) // leaving out the arguments will default to these values

//DB
const db = require("../../config/db");
const { request } = require("http");

const output = {
    root : (req,res) => {
        res.render('home/home');
    },
    login : (req,res) => {
        res.render("home/login");
    },
    register : (req,res) => {
        res.render("home/register");
    },
    artDetail : (req,res) => {
        const likeId = req.query.likeId;
        const viewId = req.query.viewId;
        var artId = 0;

        if(likeId == undefined){
            const viewId1 = parseInt(viewId);
            view_count(viewId1,res);
            artId = viewId1;
        } else {
            const likeId1 = parseInt(likeId);
            view_count(likeId1,res);
            like_count(likeId1);
            artId = likeId1;
        }

        // 뷰
        const query2 = "SELECT art.*, login_designer.username FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId where art.art_id=?;";
        db.query(query2, [artId], (err,rows) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Sever Error");
            } else {
                // console.log(rows[0].author_id);
                const query3 = "SELECT art.*, login_designer.username FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId where author_id=?;";
                db.query(query3, [rows[0].author_id], (err,data) => {
                    if(err){
                        console.error("query error" + err);
                        res.status(500).send("Internal Sever Error");
                    } else {
                        console.log(rows);
                        console.log('---------------------------------------------------------');
                        console.log(data);
                        res.render("home/art_detail",{row : rows[0], data : data});
                    }
                })   
            }
        })
    },
    art : (req,res) => {
        //좋아요 함수
         const likeId = req.query.likeId;
         like_count(likeId);

        //정렬 쿼리문 정의
        const major_select = req.query.major_select;
        const art_select = req.query.art_select;
        const query = art_sorting(major_select,art_select);

        db.query(query,(err,rows) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Sever Error");
            } else {
                console.log(rows);
                res.render("home/art",{rows: rows});
            }
        })
    },    
    authorPortfolio : (req,res) => {
        const UserName = req.query.user; 
        // 뷰
        const query = "SELECT art.*, login_designer.* FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId where login_designer.username=? ORDER BY art.like DESC;";
        db.query(query, [UserName], (err,rows) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Server Error");
            } else {
                console.log(rows);
                // 전체 조회수
                var view_sum = 0;
                for(let row of rows) {
                    view_sum += row.view_count;
                }
                res.render("home/author_portfolio",{rows : rows, view_sum: view_sum});
            }
        })
    },
    authorPortfolio_nft: async (req,res) => {
        const UserName = req.query.user; 
        // 뷰
        const query = "SELECT art.*, login_designer.* FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId where login_designer.username=? ORDER BY art.like DESC;";
        db.query(query, [UserName], (err,rows) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Server Error");
            } else {
                console.log(rows);
                // 전체 조회수
                var view_sum = 0;
                for(let row of rows) {
                    view_sum += row.view_count;
                }
                res.render("home/author_portfolio_nft",{rows : rows, view_sum: view_sum});
            }
        })
    },
    authors : (req,res) => {
        res.render("home/authors");
    },    
    myPage : (req,res) => {
        res.render("home/mypage");
    },    
    errPage : (req,res) => {
        res.render("home/404");
    },    
    generateNFT : (req,res) => {
        const likeId = req.query.likeId;
        const viewId = req.query.viewId;
        var artId = 0;

        if(likeId == undefined){
            const viewId1 = parseInt(viewId);
            view_count(viewId1,res);
            artId = viewId1;
        } else {
            const likeId1 = parseInt(likeId);
            view_count(likeId1,res);
            like_count(likeId1);
            artId = likeId1;
        }

        // 뷰
        const query2 = "SELECT art.*, login_designer.username FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId where art.art_id=?;";
        db.query(query2, [artId], (err,rows) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Sever Error");
            } else {
                // console.log(rows[0].author_id);
                const query3 = "SELECT art.*, login_designer.username FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId where author_id=?;";
                db.query(query3, [rows[0].author_id], (err,data) => {
                    if(err){
                        console.error("query error" + err);
                        res.status(500).send("Internal Sever Error");
                    } else {
                        console.log(rows);
                        console.log('---------------------------------------------------------');
                        console.log(data);
                        res.render("home/generateNFT",{row : rows[0], data : data});
                    }
                })   
            }
        })
    },    
};

const process = {

    login : async (req,res) => {
        const user = new User(req.body);
        const response = await user.login(req);
        return res.json(response);
    },
    register : async (req,res) => {
        const user = new User(req.body);
        const response = await user.register();
        return res.json(response);
    },
    artRegister : async (req,res) => { 

        // 파일 ipfs 등록 및 CID, ipfsLink 반환
        var data = new Buffer(fs.readFileSync(req.file.path));

        //IPFS
        var ipfsVal = await ipfs.add(data);

        //ipfs link generate
        var url = 'https://infura-ipfs.io/ipfs/';
        url += (ipfsVal[0].hash);
        url += '?filename=';
        url += (req.file.originalname);
        var ipfsUrl =  encodeURI(url);


        //넘겨줄 ipfs값들(url,cid)
        var ipfsResultVal = {
            ipfsCid: ipfsVal[0].hash,
            ipfsUrl: ipfsUrl
        }

        //DB
        const user = new User(req.body,ipfsResultVal);
        const response = await user.art_register();
        return res.json(response);
        
    },

    personalinfoModification : async (req,res) => { 

        // 파일 ipfs 등록 및 CID, ipfsLink 반환
        var data = new Buffer(fs.readFileSync(req.file.path));

        //IPFS
        var ipfsVal = await ipfs.add(data);

        //ipfs link generate
        var url = 'https://infura-ipfs.io/ipfs/';
        url += (ipfsVal[0].hash);
        url += '?filename=';
        url += (req.file.originalname);
        var ipfsUrl =  encodeURI(url);
        

        //넘겨줄 ipfs값들(url,cid)
        var ipfsResultVal = {
            ipfsCid: ipfsVal[0].hash,
            ipfsUrl: ipfsUrl
        }

      //DB
        const user = new User(req.body,ipfsResultVal);
        const response = await user.personal_info();
        return res.json(response);
        
    },

    authorPortfolio_nft: async (req,res) => { 
    console.log(req.body.LoginId);
    //DB
      const user = new User(req.body.LoginId);
      const response = await user.author_portfolio_nft();
      console.log(response);
      return res.json(response);
    },



};

// 좋아요 DB 적용 함수
function like_count(likeId) {
    if(likeId == undefined) {

    } else {
        const like_query = "UPDATE NFT.art SET art.like = art.like+1 where art_id=?;"
        db.query(like_query,[likeId],(err,rows)=> {
            if(err){
               console.error("query error" + err);
               res.status(500).send("Internal Sever Error");
            }
        })
    }
}

//정렬 쿼리문 정의 함수
function art_sorting(major_select,art_select) {

         //정렬
         var query="SELECT art.*, login_designer.* FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId ";
         var query1="";
         var query2="";
 
         //정렬에 따라 sql문 정의
         if(art_select === "가장 많이 본 작품"){
             query2 = "ORDER BY art.view_count DESC;";
         } else if(art_select === "인기있는 작품") {
             query2 = "ORDER BY art.like DESC;";
         } else if(art_select === "최근 작품") {
             query2 = "ORDER BY date_1 DESC;";
         } else {
             query2 = "ORDER BY art.art_id DESC;";
         }
 
         if(major_select === "커뮤니케이션디자인전공") {
             query1="where login_designer.major = 커뮤니케이션디자인전공 ";
         } else if(major_select === "텍스타일디자인전공") {
             query1="where login_designer.major = 텍스타일디자인전공 ";
         } else if(major_select === "세라믹디자인전공") {
             query1="where login_designer.major = 세라믹디자인전공 ";
         } else if(major_select === "AR·VR미디어디자인전공") {
             query1="where login_designer.major = AR·VR미디어디자인전공 ";
         } else if(major_select === "패션디자인전공") {
             query1="where login_designer.major = 패션디자인전공 ";
         } else if(major_select === "인더스트리얼디자인전공") {
             query1="where login_designer.major = 인더스트리얼디자인전공 ";
         } else if(major_select === "영화영상전공") {
             query1="where login_designer.major = 영화영상전공 ";
         } else if(major_select === "연극전공") {
             query1="where login_designer.major = 연극전공 ";
         } else if(major_select === "무대미술전공") {
             query1="where login_designer.major = 무대미술전공 ";
         } else if(major_select === "사진영상미디어전공") {
             query1="where login_designer.major = 사진영상미디어전공 ";
         } else if(major_select === "디지털만화영상전공") {
             query1="where login_designer.major = 디지털만화영상전공 ";
         } else if(major_select === "문화예술경영전공") {
             query1="where login_designer.major = 문화예술경영전공 ";
         } else if(major_select === "디지털콘텐츠전공") {
             query1="where login_designer.major = 디지털콘텐츠전공 ";
         } else {
         }
 
         //SQL문 완성
         query += query1;
         query += query2;
         return query;
}

function view_count(art_id, res) {
    const view_query = "UPDATE NFT.art SET view_count = view_count +1 where art_id=?;"
        db.query(view_query,[art_id],(err,rows)=> {
            if(err){
               console.error("query error" + err);
               res.status(500).send("Internal Sever Error");
            }
        })
}


module.exports = {
    output,
    process,
};