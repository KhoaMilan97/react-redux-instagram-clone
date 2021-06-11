const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    proxy("/api", {
      target: "https://instagram-clone-api-v1.herokuapp.com",
      changeOrigin: true,
    })
  );
};
