# koa-jsonp-demo
通过koa实现jsonp的接口提供前端使用。 

### 使用到的模块依赖

> + [koa-logger](https://github.com/koajs/logger) 【描述】Development style logging middleware

> + [koa-router](https://github.com/alexmingoia/koa-router)【描述】Router middleware for koa.

> + [koa-views](https://github.com/queckezz/koa-views)【描述】渲染模板文件（ejs,html）
koa-static

## 项目说明

- 启动：`npm run start`

```
|--routes/
|  |--api.js        接口路由
|  |--pages.js      页面路由
|
|--static/
|  |--javascript/
|  |   |--axios.js
|  |   |--index.js  调用接口的js
|  |--styles/
|      |--index.css
|
|--views/
|  |--index.ejs    ejs模板
|
|--app.js          入口文件
|--package.json
|--README.md
```


### 一、 什么是同源策略？

##### 1. 同源策略是一个重要的安全策略，它用于限制一个origin的文档或者它加载的脚本如何能与另一个源的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介。

#### 2. 同源的定义

> 如果两个 URL 的 protocol、port (如果有指定的话)和 host 都相同的话，则这两个 URL 是同源。这个方案也被称为“协议/主机/端口元组”，或者直接是 “元组”。（“元组” 是指一组项目构成的整体，双重/三重/四重/五重/等的通用形式）。

下表给出了与 URL http://store.company.com/dir/page.html 的源进行对比的示例:

|URL|结果|原因|
|--|--|--|
|http://store.company.com/dir2/other.html|	同源|	只有路径不同|
|http://store.company.com/dir/inner/another.html|	同源|	只有路径不同|
|https://store.company.com/secure.html	|失败|	协议不同|
|http://store.company.com:81/dir/etc.html	|失败|	端口不同 ( http:// 默认端口是80)|
|http://news.company.com/dir/other.html	|失败|	主机不同|


#### 二、常用的跨域解决方式？

> 以下几种方法是我平时工作中常用到的，cors和nginx前端是无感知的；但是如果是nodejs做中间件处理，跨域就不需要后端人员参与了；而jsonp的方式就需要前后端进行配合，后端需要对jsonp进行支持，前端需要使用特殊的请求接口的方法。

1. 由后端开发人员设置cors；
2. 运维人员通过nginx代理；
3. 通过nodejs作为中间件；
4. 前后端配合，使用jsonp跨域；



### 二、JSONP的实现模式--CallBack

- jsonp的机制是，我们传给服务器一个callback参数，值是我们要调用的函数名字，然后服务器返回一个字符串，这个字符串不仅仅是需要返回的数据，而且这个数据要用这个函数名字包裹。

- 解析请求所带的参数，并且读取callback参数的值。解决方法是，我们用ctx.request.query获得请求所带的所有参数，然后读取出callback参数：ctx.request.query.callback。

- 把数据转化为字符串，并用这个函数名包裹。

##### 前端js实现jsonp

> 见`static/javascript/index.js`

+ 因为script、img、link是可以跨域加载资源的，没有被通源策略所限制，因此jsonp实际就是通过这一类标签加载资源的时候发出get请求()，同时将回调函数添加到url上面(如：?callback=jsonpmethod)，后端接收到对其单独处理，将返回数据放到`jsonpmethod`中返回。
 
```
 jsonpData: function () {
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.src = "/api/userjsonp?callback=jsonpmethod";
    document.body.appendChild(script);
  },
```

##### node端实现jsonp支持

> 代码见 `routes/api.js`，其中包含了get、post、jsonp三种方法的对比；

+ get和post方法直接通过穿ctx.body返回一个json就可以

```
ctx.body = {
    code:200,
    data,
    msg:'success'
};
```

+ jsonp的需要对返回值做处理，如果请求URL为***?callback=jsonpmethod,返回为``jsonpmethod(json字符串)``的格式

```
const result = JSON.stringify({
    code:200,
    data,
    msg:'success'
});
ctx.body = `jsonpmethod(${result})`;
```


