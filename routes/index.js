const Router = require('koa-router');
const router = new Router();

router.get('index', async function (ctx, next) {
    await ctx.render('index',{
        title:"首页1"
    });
});

router.get('user', async function (ctx, next) {

    ctx.body = {"retcode":"success","name":"zhaojing"};
});

module.exports = router;