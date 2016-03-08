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
        jquery: ['../node_modules/jquery/dist/jquery.min.js'],
        bootstrap_js: ['../node_modules/bootstrap/dist/js/bootstrap.min.js'],
    },
    output: {
        path: path.resolve(__dirname, './banking/static/js'),
        filename: '[name].js', // use entry field name.
        // for hot reload.
        publicPath: 'http://localhost:3000/assets/bundles/',
        library: '$' // for inlined JS in HTML.
    },


    plugins: [
        // reload only changed part of page
        // new webpack.HotModuleReplacementPlugin(),
        // no genereta empty output, if errors occur
        new webpack.NoErrorsPlugin(),
        // integration with django
        new BundleTracker({filename: './webpack-stats.json'}),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'commons',
        // }),

        new webpack.ProvidePlugin({ // for bootstrap.js in node_modules
            jQuery: 'jquery',
        }),
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
