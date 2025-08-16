const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/main/main.ts',
  target: 'electron-main',
  output: {
    path: path.resolve(__dirname, 'dist/main'),
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
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
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    'sqlite3': 'commonjs sqlite3',
    'bcrypt': 'commonjs bcrypt'
  },
  node: {
    __dirname: false,
    __filename: false
  }
};
