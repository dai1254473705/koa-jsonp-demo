/*
 * ===============================
 * 本地输出的日志
 * @DATE 2018-5-29 15:41
 * @AUTHOR daiyunzhou
 * ===============================
 */
const winston = require('winston');
const fs = require('fs');
const path = require('path');
require('winston-daily-rotate-file');
const fsDirectorSync = require("../utils/fsDirectory");
/*
* ========================================
* 日志目录 -- 手动输出日志
* ========================================
*/

const logDirectoryInfo = path.join(__dirname, '../logs/localLogger/info');
const logDirectoryError = path.join(__dirname, '../logs/localLogger/error');

// 日志根目录是否存在
fsDirectorSync(logDirectoryInfo);
fsDirectorSync(logDirectoryError);

const logger = new (winston.Logger)({
    // level: level,
    transports: [
        new (winston.transports.Console)({
            level: 'log',
            json: false
        }),
        new (winston.transports.DailyRotateFile)({
            name: 'info-file',
            filename: logDirectoryInfo,
            datePattern: '_yyyyMMdd_access.log',
            prepend: false,
            localTime: true,
            level: 'info',
            zippedArchive: true,
            maxSize: '100m',
            maxFiles: '30d'
        }),
        new (winston.transports.DailyRotateFile)({
            name: 'error-file',
            filename: logDirectoryError,
            datePattern: '_yyyyMMdd_access.log',
            prepend: false,
            localTime: true,
            level: 'error',
            zippedArchive: true,
            maxSize: '100m',
            maxFiles: '30d'
        })
    ]
});

module.exports = logger;