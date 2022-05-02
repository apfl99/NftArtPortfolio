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
        // 작품 Id
        const artId = req.query.viewId;
        //조회수 처리
        const query1 = "UPDATE NFT.art SET view_count = view_count +1 where art_id=?;"
        db.query(query1,[artId], (err,rows) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Server Error");
            } else {
                // 뷰
                const query2 = "SELECT art.*, login_designer.username FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId where art.art_id=?;";
                db.query(query2, [artId], (err,rows) => {
                    if(err) {
                        console.error("query error" + err);
                        res.status(500).send("Internal Sever Error");
                    } else {
                        res.render("home/art_detail",{row : rows[0]});
                    }
                })
            }
        })
    },
    art : (req,res) => {
        const query = "SELECT art.*, login_designer.username FROM art LEFT JOIN login_designer ON art.author_id = login_designer.userId ORDER BY art.art_id;";
        db.query(query,(err,rows) => {
            if(err) {
                console.error("query error" + err);
                res.status(500).send("Internal Sever Error");
            } else {
                res.render("home/art",{rows: rows});
            }
        })
    },    
    authorPortfolio : (req,res) => {
        res.render("home/author_portfolio");
    },
    authorPortfolio_nft : (req,res) => {
        res.render("home/author_portfolio_nft");
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
        res.render("home/generateNFT");
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
        
    }

};



module.exports = {
    output,
    process,
};