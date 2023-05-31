const path = require("path");
const webpack = require("webpack");
const RefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  name: "mine-setting",
  mode: "production", // development production
  devtool: "hidden-source-map", // eval hidden-source-map
  resolve: {
    extensions: [".js", ".jsx"],
  },

  entry: {
    app: ["./client"],
  }, // 입력

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  browsers: ["> 1% in KR"], // babel browserslist 참고
                },
                debug: true,
              },
            ],
            "@babel/preset-react",
          ],
          plugins: ["react-refresh/babel"], // 바벨이 동작할 때 hot 리로딩 기능(react-refresh)을 추가해줌
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  }, // 입력과 출력 사이의 실행할 모듈을 설정(babel-loader)

  // plugins: [new webpack.LoaderOptionsPlugin({ debug: true })],
  plugins: [new RefreshWebpackPlugin()],

  output: {
    path: path.join(__dirname, "dist"),
    filename: "app.js",
    publicPath: "/dist",
  }, // 출력 경로을 지정

  devServer: {
    devMiddleware: { publicPath: "/dist" }, // 감시 파일이 변경될 경우 결과물을 저장할 경로
    static: { directory: path.resolve(__dirname) }, // 감시 파일의 경로
    hot: true, // hot 리로딩 on/off
  },
};
