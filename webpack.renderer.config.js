const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/renderer/index.tsx',
  target: 'web', // Changed from 'electron-renderer'
  output: {
    path: path.resolve(__dirname, 'dist/renderer'),
    filename: isDevelopment ? '[name].js' : '[name].[contenthash].js',
    clean: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core-foundation'),
      '@data': path.resolve(__dirname, 'src/data-layer'),
      '@security': path.resolve(__dirname, 'src/security'),
      '@guardian-protect': path.resolve(__dirname, 'src/guardian-protect'),
      '@guardian-insight': path.resolve(__dirname, 'src/guardian-insight'),
      '@guardian-caretrack': path.resolve(__dirname, 'src/guardian-caretrack'),
      '@guardian-carepro': path.resolve(__dirname, 'src/guardian-carepro'),
      '@config': path.resolve(__dirname, 'src/configuration-center'),
      '@dashboard': path.resolve(__dirname, 'src/dashboard'),
      '@family': path.resolve(__dirname, 'src/family-portal'),
      '@emergency': path.resolve(__dirname, 'src/emergency-response'),
      '@reporting': path.resolve(__dirname, 'src/reporting-analytics'),
      '@communication': path.resolve(__dirname, 'src/communication'),
      '@integration': path.resolve(__dirname, 'src/integration-api'),
      '@quality': path.resolve(__dirname, 'src/quality-monitoring'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@assets': path.resolve(__dirname, 'assets')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.renderer.json'
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
      favicon: './build/icon.ico'
    }),
    new webpack.DefinePlugin({
      'global': 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    ...(isDevelopment ? [] : [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      })
    ])
  ],
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
};