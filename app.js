/**
 * koa2 App.js
 * 项目入口文件
 */
"use strict";

const http = require("http");
const Koa = require("koa");
const logger = require("koa-logger");
const views = require("koa-views");
const path = require("path");
const Router = require("koa-router");
const serve = require("koa-static");
const app = new Koa();
const router = new Router();

/*
 * ========================================
 * 加载中间件
 * ========================================
 */
app.use(logger());
app.use(serve(__dirname + "/static"));

/*
 * ========================================
 * 页面模板渲染设置
 * Must be used before any router is used
 * ========================================
 */
app.use(
  views(path.join(__dirname, "/views"), {
    autoRender: false,
    extension: "ejs",
  })
);

/*
 * ========================================
 * 引入外部route文件
 * ========================================
 */
const pageRoute = require("./routes/pages");
const apiRoute = require("./routes/api");

/*
 * ========================================
 * router.use 外部文件
 * ========================================
 */
router.use("/", pageRoute.routes(), pageRoute.allowedMethods());
router.use("/api", apiRoute.routes(), apiRoute.allowedMethods());

/*
 * ========================================
 * 初始化router
 * ========================================
 */
app.use(router.routes()).use(router.allowedMethods());

// 捕获ctx.app.emit("error", err, ctx);触发的异常
app.on("error", (err, ctx) => {
  const errorData = `
    =================================================================
    ${err}
    =================================================================
    `;
  console.log(errorData);
});

/*
 * ==========================================
 * 拦截404 根据访问的是html,还是接口返回不同的内容
 * ==========================================
 */
app.use(async (ctx) => {
  ctx.status = 404;
  switch (ctx.accepts("html", "json")) {
    case "html":
      ctx.type = "html";
      ctx.body = "<p>Page Not Found</p>";
      break;
    case "json":
      ctx.body = {
        message: "Page Not Found",
      };
      break;
    default:
      ctx.type = "text";
      ctx.body = "Page Not Found";
  }
});

// 监听端口3000
http.createServer(app.callback()).listen(8081, () => {
  console.log("running: \n http:127.0.0.1:8081/");
});
