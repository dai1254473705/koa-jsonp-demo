/**
 * koa2 App.js
 * 项目入口文件
 */
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


/*
 * ========================================
 * 页面模板渲染设置
 * Must be used before any router is used
 * ========================================
 */
app.use(views(path.join(__dirname, '/views'), {extension: 'html'}));


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
 * 日志目录 -- 访问日志
 * ========================================
 */
const logRoot = path.join(__dirname, 'logs');
const logDirectory = path.join(__dirname, 'logs/httpRequest');

// 日志根目录是否存在
fs.existsSync(logRoot) || fs.mkdirSync(logRoot);

//日志网络请求文件夹是否存在
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

/*
 * ========================================
 * 设置日志输入文件格式
 * 单个文件20M,大于20M再生成一个文件
 * ========================================
 */
let accessLogStream = rfs(`access.log`, {
    size: '20M', // rotate every 10 MegaBytes written
    // interval: '1d',  //1天一个日志文件
    interval: '10m',  // 10分钟输出一个日志文件
    path: logDirectory
});

// 控制台输出日志
app.use(morgan('dev'));

//将日志写入到logs/request/
app.use(morgan(function (tokens, req, res) {
    return [
        tokens["remote-addr"](req, res), '-',
        moment(tokens.date(req, res)).format("YYYY-MM-DD hh:mm:ss"), '-',
        tokens.status(req, res), '-',
        tokens.method(req, res), '-',
        tokens.url(req, res), '-',
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}, {stream: accessLogStream}));

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
http.createServer(app.callback()).listen(3000);
