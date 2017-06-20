var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: __dirname+"/src/apps/planning.js",
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
		          fallback: 'style-loader',
		          use: ['css-loader', 'sass-loader']
		        })
            }
		]
	},
	output: {
		filename: 'bundle.js',
		path: __dirname+"/public/build"
	},
	plugins: [
        new ExtractTextPlugin({
		    filename:  "bundle.css",
		    allChunks: true
		  })
    ]
};