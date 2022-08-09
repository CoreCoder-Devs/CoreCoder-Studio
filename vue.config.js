const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        target: "electron-renderer",
        plugins: [new NodePolyfillPlugin()],
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            preload: "src/preload.js",
        },
    },
});
