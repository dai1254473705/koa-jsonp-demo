/**
 * 测试jsonp
 */
var koaJsonpDemo = {
  renderData: function (res) {
    document.querySelector("#response").innerHTML = JSON.stringify(
      res,
      null,
      2
    );
  },
  getData: function () {
    var that = this;
    axios
      .get("/api/userget?sdf=df")
      .then(function (response) {
        that.renderData(response.data);
      })
      .catch(function (error) {
        that.renderData(error);
      });
  },
  postData: function () {
    var that = this;
    axios
      .post("/api/userpost")
      .then(function (response) {
        that.renderData(response.data);
      })
      .catch(function (error) {
        that.renderData(error);
      });
  },
  jsonpData: function () {
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.src = "/api/userjsonp?callback=jsonpmethod";
    document.body.appendChild(script);
  },
  init: function () {
    // get请求获取数据
    document.querySelector(".getData").onclick = function () {
      this.getData();
    }.bind(this);

    // post请求获取数据
    document.querySelector(".postData").onclick = function () {
      this.postData();
    }.bind(this);

    // jsonp请求获取数据
    document.querySelector(".jsonpData").onclick = function () {
      this.jsonpData();
    }.bind(this);
  },
};
function jsonpmethod(data) {
  console.log("data", data);
  koaJsonpDemo.renderData(data);
}
koaJsonpDemo.init();
