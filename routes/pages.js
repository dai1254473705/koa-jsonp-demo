/**
 * 页面模板路由
 */
'use strict';

const Router = require('koa-router');
const router = new Router();

/**
 * 首页页面路由
 */
router.get('/', async function (ctx, next) {
    console.log("首页router ===>",ctx);
    const res = await ctx.render('index',{
        title:'首页啊',
        text:`
            1.jsonp的机制是，我们传给服务器一个callback参数，值是我们要调用的函数名字，然后服务器返回一个字符串，这个字符串不仅仅是需要返回的数据，而且这个数据要用这个函数名字包裹。<br/>
            2.解析请求所带的参数，并且读取callback参数的值。解决方法是，我们用ctx.request.query获得请求所带的所有参数，然后读取出callback参数：ctx.request.query.callback。<br/>
            3.把数据转化为字符串，并用这个函数名包裹。这个很简单，字符串连接即可。<br/>
        `
    });
    ctx.body = res;
});

module.exports = router;
