module.exports = {
  entry: {
    bundle1: './main1.js',
    bundle2: './main2.js'
  },
  output: {
  	path:'dist',
    filename: '[name].js'
  }
};
