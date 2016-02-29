var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
    context: __dirname,

    entry: [
		'webpack-dev-server/client?http://localhost:3000',
		'webpack/hot/only-dev-server',
        './assets/js/index', // entry point
	],
    output: {
        path: path.resolve('./assets/bundles/'),
        filename: '[name]-[hash].js',
        publicPath: 'http://localhost:3000/assets/bundles/',
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new BundleTracker({filename: './webpack-stats.json'}),
    ],

    module: {
        loaders: [
            // to transform JSX into JS
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015'],
                //  query: {
                //      presets: ['es2015', 'react']
                //  }
            },
        ]
    },

    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js', '.jsx']
    },
}
