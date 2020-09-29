# koa-jsonp-demo
通过koa实现jsonp的接口提供前端使用。 

### 使用到的模块依赖

> + [koa-logger](https://github.com/koajs/logger) 【描述】Development style logging middleware

> + [moment](http://momentjs.cn/)【描述】JavaScript 日期处理类库

> + [koa-router](https://github.com/alexmingoia/koa-router)【描述】Router middleware for koa.

> + [koa-views](https://github.com/queckezz/koa-views)【描述】渲染模板文件（ejs,html）
koa-static

### 一、 同源策略

> 同源策略，它是由Netscape提出的一个著名的安全策略。
现在所有支持JavaScript 的浏览器都会使用这个策略。所谓同源是指，域名，协议，端口相同。
当一个浏览器的两个tab页中分别打开百度和谷歌的页面
当一个百度浏览器执行一个脚本的时候会检查这个脚本是属于哪个页面的
即检查是否同源，只有和百度同源的脚本才会被执行。

### 二、JSONP的实现模式--CallBack

- jsonp的机制是，我们传给服务器一个callback参数，值是我们要调用的函数名字，然后服务器返回一个字符串，这个字符串不仅仅是需要返回的数据，而且这个数据要用这个函数名字包裹。

- 解析请求所带的参数，并且读取callback参数的值。解决方法是，我们用ctx.request.query获得请求所带的所有参数，然后读取出callback参数：ctx.request.query.callback。

- 把数据转化为字符串，并用这个函数名包裹。这个很简单，字符串连接即可。

