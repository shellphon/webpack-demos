module.exports = {
  entry: './main.js',
  output: {
    filename: 'dist/bundle.js'
  },
  module: {
    loaders:[
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
    ]
  }
};
