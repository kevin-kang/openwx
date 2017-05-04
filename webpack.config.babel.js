import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import opt from 'minimist'; //获取命令行参数

let args = process.argv,
    argsOpt = opt(args);

let commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
        name: 'JSSDK',
        filename: 'js/[name].js'
    }),
    ExtractSCSS = new ExtractTextPlugin('css/[name].css'),
    config = {
        devtool: argsOpt.pro || argsOpt.test || argsOpt.repro ? '#' : '#source-map',
        debug: argsOpt.pro || argsOpt.test || argsOpt.repro ? false : true,
        cache: argsOpt.pro || argsOpt.test || argsOpt.repro ? false : true,
        profile: argsOpt.pro || argsOpt.test || argsOpt.repro ? false : true,
        entry: {
            'index': './src/js/index.js'
        },
        output: {
            path: '', //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
            publicPath: '', //模板、样式、脚本、图片等资源对应的server上的路径
            filename: 'js/[name].js', //每个页面对应的主js的生成配置
            sourceMapFilename: 'js/[name].map'
        },
        plugins: [
            // new webpack.ProvidePlugin({ //引入全局zepto
            //     $: 'webpack-zepto'
            // }),
            // new webpack.optimize.UglifyJsPlugin({
            //     compress: {
            //         warnings: false
            //     }
            // }),
            // new CopyWebpackPlugin([{ //目录拷贝
            //     from: 'src/readme.md'
            // }]),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.DedupePlugin(),
            // commonsPlugin,
            ExtractSCSS, //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
            new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
                cache: false,
                // favicon: './src/img/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
                filename: './index.html', //生成的html存放路径，相对于path
                template: 'src/index.html', //html模板路径
                inject: true, //js插入的位置，true/'head'/'body'/false
                hash: true, //为静态资源生成hash值
                chunks: ['index'], //需要引入的chunk，不配置就会引入所有页面的资源
                // minify: {
                //     removeComments: true, //移除HTML中的注释
                //     collapseWhitespace: true
                // }
            })
        ],
        resolve: {
            root: './src',
            modulesDirectories: ['node_modules']
        },
        module: {
            loaders: [{
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url?limit=15000&name=css/img/[name].[ext]?[hash]'

            }, {
                test: /\.html$/,
                loader: 'html'
            }, {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    cacheDirectory: true,
                    plugins: ['transform-runtime'],
                    sourceMaps: 'both'
                }
            }, { //编译SCSS生成link链接
                test: /\.scss$/,
                loader: ExtractSCSS.extract('style', 'css!sass')
            }]
        },
        sassLoader: {
            outputStyle: 'compressed'
        }
    };

export default config;