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

    await ctx.render('index', {
        layout:"xx.hbs"
    });

});

router.get('user', async function (ctx, next) {

    ctx.body = {"retcode":"success","name":"zhaojing"};
});

module.exports = router;