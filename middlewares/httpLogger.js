/*
 * ===============================
 * http 请求日志
 * @DATE 2018-5-29 14:38
 * @AUTHOR daiyunzhou
 * ===============================
 */
const path = require('path');
const morgan = require('koa-morgan');
const rfs = require('rotating-file-stream');
const moment = require('moment');
const fsDirectorSync = require("../utils/fsDirectory");

let httpLogger = (app) => {
    /*
     * ========================================
     * 日志目录 -- 访问日志
     * ========================================
     */
    const logDirectory = path.join(__dirname, '../logs/httpRequest');

    // 日志根目录是否存在
    fsDirectorSync(logDirectory);

    /*
     * ========================================
     * 设置日志输入文件格式
     * 单个文件20M,大于20M再生成一个文件
     * ========================================
     */
    function pad(num) {
        return (num > 9 ? "" : "0") + num;
    }

    function generator(currentTime, currentIndex) {
        let time = currentTime;
        let index = currentIndex;
        if(! currentTime){
            time = new Date();
            index = 0;
        }


        var month  = time.getFullYear() + "" + pad(time.getMonth() + 1);
        var day    = pad(time.getDate());
        var hour   = pad(time.getHours());

        return month + "/" + month +
            day + "-" + hour  + "-access.log";
    }
    let accessLogStream = rfs(generator, {
        interval: '1h',  //1小时一个日志文件
        path: logDirectory
    });

    // 控制台输出日志
    app.use(morgan('dev'));


    //将日志写入到logs/request/
    app.use(morgan(function (tokens, req, res) {
        console.log(JSON.stringify(tokens["remote-addr"]));
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