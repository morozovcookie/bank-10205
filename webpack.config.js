var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')


module.exports = {
    context: path.resolve(__dirname, './banking/'),

    entry: {
        //
        main:   ['./frontend/js/index.js'],
        events: ['./frontend/js/events.js'],
        users:  ['./frontend/js/users.js'],
        auth:   ['./frontend/js/auth.js'],
    },
    output: {
        path: path.resolve(__dirname, './banking/statis/js'),
        filename: '[name].js', // use entry field name.
        // for hot reload.
        publicPath: 'http://localhost:3000/assets/bundles/',
    },

    plugins: [
        // reload only changed part of page
        // new webpack.HotModuleReplacementPlugin(),
        // no genereta empty output, if errors occur
        new webpack.NoErrorsPlugin(),
        // integration with django
        new BundleTracker({filename: './webpack-stats.json'}),
    ],

    module: {
        loaders: [
            // to transform JSX into JS
            {
                test: [/\.js?$/, /\.jsx?$/],
                exclude: /node_modules/,
                loader: 'react-hot',
            },
            {
                test: [/\.js?$/, /\.jsx?$/],
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            },
        ]
    },

    resolve: {
        root: __dirname,
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js', '.jsx']
    },

    devtool: 'eval',
}
