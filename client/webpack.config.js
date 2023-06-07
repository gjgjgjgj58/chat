const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, 'src', 'index.js'),
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'build'),
        // react-router-dom 특정 URL 접근을 위해 필요한 옵션
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.?(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
                resolve: {
                    extensions: ['.js', '.jsx']
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jp(e*)g|svg|gif|ico)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/')
        }
    },
    devServer: {
        hot: true,
        open: true,
        host: 'localhost',
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true
            },
            '/images': {
                target: 'http://localhost:3001',
                secure: true,
                changeOrigin: true
            }
        },
        historyApiFallback: true
    }
};
