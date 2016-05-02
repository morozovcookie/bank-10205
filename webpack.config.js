var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

// yo dawg i heard you like configs so we put a config in yo config so you can
// config when you config.
var ENV_BANK = process.env.BANK;
var DEFS = {};
if (!ENV_BANK || ENV_BANK === "") {
  DEFS.dev = false;
}
else {
  DEFS = JSON.parse(ENV_BANK);
  if (DEFS.dev == undefined) DEFS.dev = false;
}

var config = {
context: path.resolve(__dirname, './banking/'),

entry: {
    //
    jquery: ['../node_modules/jquery/dist/jquery.min.js'],
    bootstrap_js: ['../node_modules/bootstrap/dist/js/bootstrap.min.js'],
    auth:   ['./frontend/js/auth.js'],
    index:  ['./frontend/js/index.js'],
    events: ['./frontend/js/events.js'],
    users:  ['./frontend/js/users.js'],
    transactions: ['./frontend/js/transactions.js'],
},
output: {
    path: path.resolve(__dirname, './banking/static/js'),
    filename: '[name].js', // use entry field name.
    // for hot reload.
    publicPath: DEFS.dev ? 'http://localhost:3000/assets/bundles/' : '/static/js/',
    library: '$' // for inlined JS in HTML.
},


plugins: [
    // no genereta empty output, if errors occur
    new webpack.NoErrorsPlugin(),
    // integration with django
    new BundleTracker({filename: "./webpack-stats.json"}),
    // for bootstrap.js in node_modules
    new webpack.ProvidePlugin({ jQuery: 'jquery', }),
],

module: {
    loaders: [
        // to transform JSX into JS
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

}

var plugins = [];
var loaders = [];

// diff between dev & prod.
if (DEFS.dev) {
    plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );

    loaders.push(
        { // hope that order not does not affect
            test: [/\.js?$/, /\.jsx?$/],
            exclude: /node_modules/,
            loader: 'react-hot'
        }
    );

    config.devtool = 'inline-source-map';
}

else {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            // prevent renaming(mangling) this vars
            mangle: { except: ['$super', '$', 'exports', 'require'] },
            sourceMap: false // on circleCI it's throw error from UglifyJsPlugin
        })
    );
}

config.plugins = config.plugins.concat(plugins);
// prepending, because order is affects
config.module.loaders = loaders.concat(config.module.loaders);

module.exports = config;
