import webpack from 'webpack'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const EnvironmentPlugin = new webpack.EnvironmentPlugin({
  NODE_ENV: 'development',
  DEBUG: true,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
})

export default {
  mode: 'development',
  entry: {
    app: './src/app.tsx',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    globalObject: 'self',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'docs'),
  },
  devServer: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
        cert: fs.readFileSync('./localhost.pem'),
        ca: fs.readFileSync('./rootCA.pem')
    },
    static: {
      directory: path.join(__dirname, 'src'),
    },
    compress: true,
    port: 9000,
    hot: true,
    open: true,
  },
  plugins: [EnvironmentPlugin],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(ttf|png|jpg)$/,
        use: ['file-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.txt?$/,
        type: 'asset/source',
      },
    ],
  },
}
