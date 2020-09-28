const path = require('path');
// html 文件编译
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清理 dist 文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 生成 manifest.json 清单文件
const ManifestPlugin = require('webpack-manifest-plugin');
// 将css从js中拆分出来
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = env => {
    console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
    console.log('Production: ', env.production); // true
    return {
        mode: 'development',
        entry: {
            index: './src/index.js',
            print: "./src/print.js",
            main: "./src/main.js"
        },
        output: {
            filename: '[name].[contenthash].js',
            path: path.resolve(__dirname, 'dist'),
            // publicPath: '/',
            // library: "lodash",
            // pathinfo: false          //webpack能够在输出包中生成路径信息 这给捆绑了数千个模块的项目带来了垃圾回收压力
        },
        devtool: 'inline-source-map', //代码定位(不适用于生产)

        devServer: {
            contentBase: './dist', // 改变时浏览器自动刷新
            hot: true,
        },

        // externals: {
        //     lodash: {
        //         commonjs: 'lodash',
        //         commonjs2: 'lodash',
        //         amd: 'lodash',
        //         root: '_',
        //     },
        // },
        optimization: {
            moduleIds: 'hashed',
            splitChunks: {
                chunks: 'all',  // 拆分js公共包 不重复导入
            },
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            },
            usedExports: true,
            // removeAvailableModules: false,
            // removeEmptyChunks: false,
        },

        plugins: [
            new CleanWebpackPlugin(
                { cleanStaleWebpackAssets: false } //watch触发增量构建不删除文件
            ),
            new HtmlWebpackPlugin({
                title: 'Output Management',
            }),
            new MiniCssExtractPlugin(
                {
                    // Options similar to the same options in webpackOptions.output
                    // both options are optional
                    filename: '[name].[contenthash].css',
                    chunkFilename: '[id].[contenthash].css',
                }
            ),
            new ManifestPlugin(),
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                    ],
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                            },
                        },
                    ],
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    include: path.resolve(__dirname, 'src'),
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
            ],
        },
    }
};