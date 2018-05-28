// require("babel-register");
const http = require('http');
const https = require('https');
const Koa = require('koa');
const nexttest = require("./nexttest");
const app = new Koa();

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

//error免密授权
app.on('error', (err, ctx) => {
  console.log(`server error - ${err}`);
});

// response
app.use(async ctx => {
  //重定向
  // ctx.redirect('/login');
  //异常
  // ctx.throw(500);
  ctx.cookies.set("name", "koa : value")
  console.log(ctx.cookies.get("UM_distinctid"));
  console.log(`${ctx.ip}-${ctx.cookies.get("name")}`);
  ctx.body = ctx.response.status;
});

http.createServer(app.callback()).listen(3000);
// https.createServer(app.callback()).listen(3000);
