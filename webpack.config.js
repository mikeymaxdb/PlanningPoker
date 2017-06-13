module.exports = {
	entry: __dirname+"/src/apps/planning.js",
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	output: {
		filename: 'bundle.js',
		path: __dirname+"/public/build"
	}
};