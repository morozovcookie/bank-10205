var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

/** Create entry name for webpack hot realoading(WHR).
 * @return {Array} entry array, where filepath to entry wll be last.
 */
function HotEntry(filepath) {
    return [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/dev-server',
        filepath];
}

module.exports = {
    context: __dirname,

    entry: {
        //
        main:   HotEntry('./assets/js/index.js'),
        events: HotEntry('./assets/js/events.js'),
        users:  HotEntry('./assets/js/users.js'),
        auth:   HotEntry('./assets/js/auth.js'),
    },
    output: {
        path: path.resolve(__dirname, '/banking/statis/js'),
        filename: '[name].js', // use entry field name.
        // for hot reload.
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
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js', '.jsx']
    },

    devtool: 'eval',
}
