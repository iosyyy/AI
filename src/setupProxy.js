const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://8.136.225.205:9380/',
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/job', {
      target: 'http://8.136.225.205:8080/',
      changeOrigin: true,
    })
  );
  app.use(
    createProxyMiddleware('/log', {
      target: 'ws://8.136.225.205:8080/',
    })
  );
  app.use(
    createProxyMiddleware('/v1', {
      target: 'http://8.136.225.205:8080/',
    })
  );
};
