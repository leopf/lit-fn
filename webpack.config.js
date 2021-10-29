const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
  mode: "development",
  entry: path.resolve("./example/index.ts"),
  output: {
    filename: "main.js",
    path: path.resolve("./dist")
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "example/index.ejs"
    }),
  ],
  devtool: "source-map",
  devServer: {
    historyApiFallback: {
      index: '/',
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          allowTsInNodeModules: true
        }
      },
    ]
  }
};