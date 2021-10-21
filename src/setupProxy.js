const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://1.117.11.147:9380/",
      pathRewrite: { "^/api": "" },
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware("/job", {
      target: "http://127.0.0.1:8080/",
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware("/log", {
      target: "ws://127.0.0.1:8080/",
    })
  );
  app.use(
    createProxyMiddleware("/v1", {
      target: "http://127.0.0.1:8080/",
    })
  );
};
