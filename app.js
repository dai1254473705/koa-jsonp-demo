/*
 * ========================================
 * koa2 App.js
 * 项目入口文件
 * ========================================
 */
const http = require('http');
const Koa = require('koa');
const morgan = require('koa-morgan');
const koaBody = require('koa-body');
const render = require('koa-ejs');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const fs = require('fs');
const path = require('path');
const logger = require("./middlewares/localLogger");
const serve = require('koa-static');
const favicon = require('koa-favicon');
app.use(koaBody()); // ctx.request.body
app.use(serve(__dirname+ "/dist",{ extensions: ['html']}));
app.use(favicon(__dirname + '/public/favicon.ico'));
//http 请求日志
require("./middlewares/httpLogger")(app);

/*
 * ========================================
 * 引入外部route文件
 * ========================================
 */
const index = require('./routes/index');

/*
 * ========================================
 * router.use 外部文件
 * ========================================
 */
router.use('/', index.routes(), index.allowedMethods());

/*
 * ========================================
 * 初始化router
 * ========================================
 */
app.use(router.routes()).use(router.allowedMethods());



/*
 * ========================================
 * 捕获到error，
 * 输出错误日志，前台显示异常页面
 * ========================================
 */
app.use(async (ctx, next) => {

    try {
        console.log("try ===== router");
        console.log(ctx);
        await next();
    } catch (err) {
        // some errors will have .status
        // however this is not a guarantee
        ctx.status = err.status || 500;
        ctx.type = 'html';
        ctx.body = '<p>Something <em>exploded</em>, please contact Maru.</p>';
        // since we handled this manually we'll
        // want to delegate to the regular app
        // level error handling as well so that
        // centralized still functions correctly.
        ctx.app.emit('error', err, ctx);
    }
});

/*
 * ==========================================
 * 捕获error
 * ==========================================
 */
app.on('error', (err, ctx) => {
    console.log("get error", err);
    if (process.env.NODE_ENV != 'test') {
        console.log('sent error %s to the cloud', err.message);
        console.log(err);
        ctx.body = err.message
    }
});

/*
 * ==========================================
 * 拦截404 根据访问的是html,还是接口返回不同的内容
 * ==========================================
 */
app.use(async ctx => {
    ctx.status = 404;
    switch (ctx.accepts('html', 'json')) {
        case 'html':
            ctx.type = 'html';
            ctx.body = '<p>Page Not Found</p>';
            break;
        case 'json':
            ctx.body = {
                message: 'Page Not Found'
            };
            break;
        default:
            ctx.type = 'text';
            ctx.body = 'Page Not Found';
    }
    //重定向
    // ctx.redirect('/login');
    //异常
    // ctx.throw(500);
    // ctx.cookies.set("name", "koa : value")
    // console.log(ctx.cookies.get("UM_distinctid"));
    // console.log(`${ctx.ip}-${ctx.cookies.get("name")}`);
    // ctx.body = ctx.response.status;
});


//listen
http.createServer(app.callback()).listen(process.env.NODE_PORT||3010);
console.log(`sever is running at:http://127.0.0.1:${process.env.NODE_PORT||3010}`);
