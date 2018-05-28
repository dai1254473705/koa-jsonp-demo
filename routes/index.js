const http = require('http');
const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const morgan = require('koa-morgan');
const moment = require('moment');
const rfs = require('rotating-file-stream');
const views = require('koa-views');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

router.get('index', async function (ctx, next) {
    // ctx.body = 'this a index response!';
    ctx.state = {
        title: 'koa2 title'
    };
    console.log("首页router ===>",ctx);
    await ctx.render('index', {
        layout:"xx.hbs"
    });
});

module.exports = router;