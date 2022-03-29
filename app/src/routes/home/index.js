// route 모듈화
"use strict";

const express = require("express");
const router = express.Router();
const ctrl = require("./home.ctrl");

//라우팅
router.get('/', ctrl.output.root);
router.get('/login', ctrl.output.login);
router.get('/register',ctrl.output.register);
router.get('/art_detail',ctrl.output.artDetail);
router.get('/art',ctrl.output.art);
router.get('/author_portfolio',ctrl.output.authorPortfolio);
router.get('/authors',ctrl.output.authors);
router.get('/mypage',ctrl.output.myPage);
router.get('/404',ctrl.output.errPage);
router.get('/generateNFT',ctrl.output.generateNFT);

router.post('/login', ctrl.process.login);
router.post('/register',ctrl.process.register);

module.exports = router;