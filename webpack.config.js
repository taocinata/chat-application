const path = require('path')
module.exports = {
  entry: './public/js/index.js',
  output: {
    path: path.resolve(__dirname, 'public', 'js'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /(node_modules|server.js)/, loader: 'babel-loader' }
    ]
  }
}
