var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common');
var helpers = require('./helpers');
module.exports = webpackMerge(commonConfig,{
    devtool: "source-map",
    output:{
        path: helpers.root('dist'),
        publicPath:'/',
        filename:'bundle.js'
    }
});