const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === "development"
const isProd = !isDev
console.log(`isDev ${isDev}`);
const optimization = () =>{
    const config = {
        splitChunks:{
            chunks: "all"
        }
    }
    if(isProd){
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
    }
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = (extra) => {
    const loaders = [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: isDev,
            reloadAll:true
          },
        },
        'css-loader'
      ]
      if (extra) {
          loaders.push(extra)
      }
      return loaders
}
module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './index.js',
        analytics: './analytics.js'
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    optimization: optimization(),
    devServer:{
        port: 4200,
        hot: isDev
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify:{
                collapseWhitespace: isDev
            }
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin([
            { 
                from: path.resolve(__dirname, 'src/favicon.ico'), 
                to: path.resolve(__dirname, 'dist')
            },
          ]),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
              },
              {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
              },
              {
                test: /\.less$/,
                use: cssLoaders('less-loader')
              },
            {
                test: /\.(png|jpg|svg|gif)/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)/,
                use: ['file-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}