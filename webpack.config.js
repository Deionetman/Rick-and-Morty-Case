const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  
  entry: './src/index.js', 
  output: {
    filename: 'bundle.js', 
    path: path.resolve(__dirname, 'dist'), 
  },
  stats: {
    children: true, 
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
},
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',  
    }),
    new webpack.HotModuleReplacementPlugin(), 
  ],
  devtool: 'inline-source-map',  
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),  
    },
    compress: true,
    port: 3000,      
    hot: true,       
    open: true,      
    watchFiles: ['src/**/*'],  
    client: {
      webSocketURL: {
        protocol: 'ws', 
        hostname: 'localhost',
        port: 3000,
      },
      overlay: true, 
    },
  },
};
