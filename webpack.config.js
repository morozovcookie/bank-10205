var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
    context: __dirname,

    entry: {
        main: './assets/js/index.js',
        events: './assets/js/events.js',
        users: './assets/js/users.js',
        auth: './assets/js/auth.js',
    },
    output: {
        path: path.resolve('./assets/bundles/'),
        filename: '[name].js', // use entry field name.
        // for hot reload. Does it need?
        publicPath: 'http://localhost:3000/assets/bundles/',
    },

    plugins: [
        // reload only changed part of page
        new webpack.HotModuleReplacementPlugin(),
        // no genereta empty output, if errors occur
        new webpack.NoErrorsPlugin(),
        // integration with django
        new BundleTracker({filename: './webpack-stats.json'}),
    ],

    module: {
        loaders: [
            // to transform JSX into JS
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'react-hot',
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            },
        ]
    },

    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js', '.jsx']
    },

    devtool: 'eval',
}
