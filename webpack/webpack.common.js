const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const browser = process.env.BROWSER;
const BUILD_DIR_NAME = 'dist';
const SRC_DIR_NAME = 'src';

module.exports = {
    entry: {
        popup: path.join(__dirname, `../${SRC_DIR_NAME}/popup.ts`),
        background: path.join(__dirname, `../${SRC_DIR_NAME}/background/${browser}/background.ts`),
        contentscript: path.join(__dirname, `../${SRC_DIR_NAME}/contentscript.ts`),
        inject: path.join(__dirname, `../${SRC_DIR_NAME}/inject.ts`),
    },
    output: {
        path: path.join(__dirname, `../${BUILD_DIR_NAME}`),
        filename: '[name].js',
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: 'initial',
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './images', to: `../${BUILD_DIR_NAME}/images`, context: 'public' },
                {
                    from: '../node_modules/webextension-polyfill/dist/browser-polyfill.js',
                    to: `../${BUILD_DIR_NAME}/browser-polyfill.js`,
                    context: 'public',
                },
                {
                    from: '../node_modules/webextension-polyfill/dist/browser-polyfill.js.map',
                    to: `../${BUILD_DIR_NAME}/browser-polyfill.js.map`,
                    context: 'public',
                },
                { from: './popup.html', to: `../${BUILD_DIR_NAME}/popup.html`, context: 'public' },
                { from: './popup.css', to: `../${BUILD_DIR_NAME}/popup.css`, context: 'public' },
                { from: `${browser}_manifest.json`, to: `../${BUILD_DIR_NAME}/manifest.json`, context: 'public' },
            ],
        }),
    ],
};
