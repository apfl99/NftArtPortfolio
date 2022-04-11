// route 모듈화
"use strict";

const express = require("express");
const router = express.Router();
const ctrl = require("./home.ctrl");

const fs = require('fs'); // js 파일 시스템 모듈을 사용하면 컴퓨터의 파일 시스템으로 작업할 수 있습니다. 
//multer 사용
const multer  = require('multer');
const {request} = require("http");
const upload = multer({ dest: 'uploads/' }) //업로드



//라우팅
router.get('/', ctrl.output.root);
router.get('/login', ctrl.output.login);
router.get('/register',ctrl.output.register);
router.get('/art_detail',ctrl.output.artDetail);
router.get('/art',ctrl.output.art);
router.get('/author_portfolio',ctrl.output.authorPortfolio);
router.get('/author_portfolio_nft',ctrl.output.authorPortfolio_nft);
router.get('/authors',ctrl.output.authors);
router.get('/mypage',ctrl.output.myPage);
router.get('/404',ctrl.output.errPage);
router.get('/generateNFT',ctrl.output.generateNFT);

router.post('/login', ctrl.process.login);
router.post('/register',ctrl.process.register);
router.post('/artRegister',upload.single("files"),ctrl.process.artRegister);




module.exports = router;