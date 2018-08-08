const path = require("path");
const merge = require("webpack-merge");
const base = require("./webpack.base.config");

module.exports = env => {
  return merge(base(env), {
    entry: {
      background: "./src/background.js",
      app: "./src/app.js",
      server: "./src/server.js",
      'webvr-polyfill': "./node_modules/webvr-polyfill/build/webvr-polyfill.min.js",
      'peerjs': "./node_modules/peerjs/dist/peer.min.js",
      'adapter': "./node_modules/webrtc-adapter/out/adapter.js"
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "../app")
    }
  });
};
