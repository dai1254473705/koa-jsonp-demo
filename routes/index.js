const Router = require('koa-router');
const router = new Router();

router.get('/', async function(ctx, next) {
	ctx.state.name = "名字";
});

router.get('user', async function(ctx, next) {

	ctx.body = {
		"retcode": "success",
		"name": "zhaojing"
	};
});

module.exports = router;