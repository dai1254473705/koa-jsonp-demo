/*
 * ===============================
 * http 请求日志
 * @DATE 2018-5-29 14:38
 * @AUTHOR daiyunzhou
 * ===============================
 */
const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const morgan = require('koa-morgan');
const rfs = require('rotating-file-stream');
const moment = require('moment');
const app = new Koa();
let httpLogger = () => {
    /*
     * ========================================
     * 日志目录 -- 访问日志
     * ========================================
     */
    const logRoot = path.join(__dirname, '../logs');
    const logDirectory = path.join(__dirname, '../logs/httpRequest');

    // 日志根目录是否存在
    fs.existsSync(logRoot) || fs.mkdirSync(logRoot);

    //日志网络请求文件夹是否存在
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

    /*
     * ========================================
     * 设置日志输入文件格式
     * 单个文件20M,大于20M再生成一个文件
     * ========================================
     */
    let accessLogStream = rfs(`-access.log`, {
        size: '20M', // rotate every 10 MegaBytes written
        interval: '1m',  //1天一个日志文件
        // interval: '10m',  // 10分钟输出一个日志文件
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

};

module.exports = httpLogger;