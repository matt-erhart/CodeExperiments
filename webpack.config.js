// @ts-ignore
var webpack = require('webpack');
var path = require('path');

// variables
var isProduction = process.argv.indexOf('-p') >= 0;
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = (env, args) => {
  return {
    devtool: 'source-map',
    context: sourcePath,
    entry: {
      app: './main.tsx'
    },
    output: {
      path: outPath,
      filename: 'bundle.js',
      chunkFilename: '[chunkhash].js',
      publicPath: '/'
    },
    target: 'web',
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.tsx', '.jsx', '.json', '.jpg', '.ico', '.html'],
      // Fix webpack's default behavior to not load packages with jsnext:main module
      // (jsnext:main directs not usually distributable es6 format, but es6 sources)
      mainFields: ['module', 'browser', 'main'],
      alias: {
        '@media': path.resolve(__dirname, 'src/media/'),
        '@src': path.resolve(__dirname, 'src/'),
        react: path.resolve(path.join(__dirname, './node_modules/react')),
        '@store': path.resolve(__dirname, 'src/store/')
      }
    },
    module: {
        // .ts, .tsx
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'babel-loader',
          },
          {
            test: /\.js$/,
            use: ["source-map-loader"],
            enforce: "pre"
          },
        // css
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader']
          })
        },
        // static assets
        { test: /\.html$/, use: 'html-loader' },
        { test: /\.(png|svg)$/, use: 'url-loader?limit=10000' },
        { test: /\.(xml|txt)$/, use: 'raw-loader' },
        { test: /\.(jpg|gif)$/, use: 'file-loader' }
      ]
    },
    optimization: {
      splitChunks: {
        name: true,
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: -10
          }
        }
      },
      runtimeChunk: true
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.mode': JSON.stringify(args.mode)
      }),
      new WebpackCleanupPlugin(),
      new ExtractTextPlugin({
        filename: 'styles.css',
        disable: !isProduction
      }),
      new HtmlWebpackPlugin({
        template: 'media/index.html'
      })
    ],
    devServer: {
      contentBase: sourcePath,
      hot: true,
      inline: true,
      historyApiFallback: {
        disableDotRule: true
      },
      stats: 'minimal'
    },
    node: {
      // workaround for webpack-dev-server issue
      // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
      fs: 'empty',
      net: 'empty'
    }
  };
};
