const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { merge } = require("webpack-merge");

const browser = process.env.BROWSER;
const BUILD_DIR_NAME = "dist";
const SRC_DIR_NAME = "src";

baseConfig = {
    entry: {
        popup: path.join(__dirname, `../${SRC_DIR_NAME}/popup.ts`),
        background: path.join(__dirname, `../${SRC_DIR_NAME}/background/${browser}/background.ts`),
        content: path.join(__dirname, `../${SRC_DIR_NAME}/content.ts`),
        script: path.join(__dirname, `../${SRC_DIR_NAME}/script.ts`),
        preloadContent: path.join(__dirname, `../${SRC_DIR_NAME}/preload/content.ts`),
        preloadScript: path.join(__dirname, `../${SRC_DIR_NAME}/preload/script.ts`),
    },
    output: {
        path: path.join(__dirname, `../${BUILD_DIR_NAME}`),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "./images", to: `../${BUILD_DIR_NAME}/images`, context: "public" },
                { from: "./popup.html", to: `../${BUILD_DIR_NAME}/popup.html`, context: "public" },
                { from: "./popup.css", to: `../${BUILD_DIR_NAME}/popup.css`, context: "public" },
                { from: `${browser}_manifest.json`, to: `../${BUILD_DIR_NAME}/manifest.json`, context: "public" },
            ],
        }),
    ],
};

if (browser === "firefox") {
    module.exports = baseConfig;
} else {
    module.exports = merge(baseConfig, {
        entry: {
            empty: path.join(__dirname, `../${SRC_DIR_NAME}/preload/empty.ts`),
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: "../node_modules/webextension-polyfill/dist/browser-polyfill.js",
                        to: `../${BUILD_DIR_NAME}/browser-polyfill.js`,
                        context: "public",
                    },
                ],
            }),
        ],
    });
}
