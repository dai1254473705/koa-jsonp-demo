/**
 * 接口路由
 */
"use strict";

const Router = require("koa-router");
const router = new Router();

/**
 * 获取数据
 */
router.get("/userget", async function (ctx, next) {
    const data = {
        name:'userget',
        type:ctx.method,
        href:ctx.href,
        path:ctx.path,
        query:ctx.query,
        protocol:ctx.protocol,
        ip:ctx.ip,
    };
    ctx.body = {
        code:200,
        data,
        msg:'success'
    };
});

/**
 * 获取数据
 */
router.post("/userpost", async function (ctx, next) {
    const data = {
        name:'userpost',
        type:ctx.method,
        href:ctx.href,
        path:ctx.path,
        query:ctx.query,
        protocol:ctx.protocol,
        ip:ctx.ip,
    };

    ctx.body = {
        code:200,
        data,
        msg:'success'
    };
});

/**
 * 获取数据
 */
router.get("/userjsonp", async function (ctx, next) {
    const data = {
        name:'userjsonp',
        type:ctx.method,
        href:ctx.href,
        path:ctx.path,
        query:ctx.query,
        protocol:ctx.protocol,
        ip:ctx.ip,
    };
    const {callback} = ctx.request.query;
    if (!callback){
        ctx.body = {
            code:'000',
            msg:'没有callback方法'
        }
    }
    const result = JSON.stringify({
        code:200,
        data,
        msg:'success'
    });
    ctx.body = `${callback}(${result})`;
});

module.exports = router;
