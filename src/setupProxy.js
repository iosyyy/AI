const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://1.117.25.66:9380/",
      pathRewrite: { "^/api": "" },
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware("/job", {
      target: "http://1.117.25.66:8080/",
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware("/log", {
      target: "ws://1.117.25.66:8080/",
    })
  );
  app.use(
    createProxyMiddleware("/v1", {
      target: "http://1.117.25.66:8080/",
    })
  );
};
