const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');

const browser = process.env.BROWSER;
const BUILD_DIR_NAME = 'dist';
const SRC_DIR_NAME = 'src';

baseConfig = {
    entry: {
        popup: path.join(__dirname, `../${SRC_DIR_NAME}/popup.ts`),
        background: path.join(__dirname, `../${SRC_DIR_NAME}/background/${browser}/background.ts`),
        contentscript: path.join(__dirname, `../${SRC_DIR_NAME}/contentscript.ts`),
        inject: path.join(__dirname, `../${SRC_DIR_NAME}/inject.ts`),
        preload_content: path.join(__dirname, `../${SRC_DIR_NAME}/preload_content.ts`),
        preload_inject: path.join(__dirname, `../${SRC_DIR_NAME}/preload_inject.ts`),
    },
    output: {
        path: path.join(__dirname, `../${BUILD_DIR_NAME}`),
        filename: '[name].js',
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
                { from: './popup.html', to: `../${BUILD_DIR_NAME}/popup.html`, context: 'public' },
                { from: './popup.css', to: `../${BUILD_DIR_NAME}/popup.css`, context: 'public' },
                { from: `${browser}_manifest.json`, to: `../${BUILD_DIR_NAME}/manifest.json`, context: 'public' },
            ],
        }),
    ],
};

if (browser === 'firefox') {
    module.exports = baseConfig;
} else {
    module.exports = merge(baseConfig, {
        entry: {
            empty: path.join(__dirname, `../${SRC_DIR_NAME}/empty.ts`),
            run_calculator: path.join(__dirname, `../${SRC_DIR_NAME}/run_calculator.ts`),
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: 'net_request_rules.json',
                        to: `../${BUILD_DIR_NAME}/net_request_rules.json`,
                        context: 'public',
                    },
                    {
                        from: '../node_modules/webextension-polyfill/dist/browser-polyfill.js',
                        to: `../${BUILD_DIR_NAME}/browser-polyfill.js`,
                        context: 'public',
                    },
                ],
            }),
        ],
    });
}
