import webpack from "webpack";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EnvironmentPlugin = new webpack.EnvironmentPlugin({
  NODE_ENV: "production",
  DEBUG: false,
  GOOGLE_MAPS_API_KEY: "AIzaSyCr3rCOGUpIhLLcmGpWOOhmpVkRWrkqbUQ",
});

export default {
  mode: "production",
  entry: {
    app: "./src/app.tsx",
  },
  output: {
    globalObject: "self",
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "docs"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [EnvironmentPlugin],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(ttf|png|jpg)$/,
        use: ["file-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", "url-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.txt?$/,
        type: "asset/source",
      },
    ],
  },
};
