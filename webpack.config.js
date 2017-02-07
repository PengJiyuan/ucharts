var path = require('path');
var webpack = require('webpack');
var pkg = require('./package.json');

module.exports = {
	entry: [
		'src/ucharts'
	],
	output: {
		path: 'dist',
		filename: 'ucharts.js'
	},
	module: {
		loaders: []
	},
	plugins: [
		new webpack.DefinePlugin({
      VERSION: JSON.stringify(pkg.version),
    })
	],
	resolve: {
		root: path.resolve('./'),
		alias: {
			'lcl': 'LCL/dist/lcl.js'
		}
	}
};
