//require our dependencies
var path = require('path')
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')
var WebpackCleanupPlugin = require('webpack-cleanup-plugin')

module.exports = {
    //the base directory (absolute path) for resolving the entry option
    context: __dirname,
    //the entry point we created earlier. Note that './' means 
    //your current directory. You don't have to specify the extension  now,
    //because you will specify extensions later in the `resolve` section
    entry: ['./assets/dashboard/js/components/main'],

    output: {
        //where you want your compiled bundle to be stored
        path: path.resolve('./assets/dashboard/bundles/'),
        //naming convention webpack should use for your files
        filename: '[name]-[hash].js',
    },

    plugins: [
        //tells webpack where to store data about your bundles.
        new BundleTracker({ filename: './webpack-stats.json' }),
        //makes jQuery available in every module
        new webpack.ProvidePlugin({

        }),
        new WebpackCleanupPlugin()
    ],

    module: {
        loaders: [
            //a regexp that tells webpack use the following loaders on all 
            //.js and .jsx files
            {
                test: /\.jsx?$/,
                //we definitely don't want babel to transpile all the files in 
                //node_modules. That would take a long time.
                exclude: /node_modules/,
                //use the babel loader 
                loader: 'babel-loader',
                query: {
                    //specify that we will be dealing with React code
                    presets: ['react', 'stage-2', 'es2015']
                }
            },
            { 
                test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
                loader: 'url-loader?limit=100000',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, '../semantic/dist'),
                loader: 'style-loader!css-loader!postcss-loader', 
                exclude: /node_modules/,
            },
             {
                test: /\.css$/,
                include: path.resolve(__dirname, 'assets/dashboard/css'),
                loader: 'style-loader!css-loader!postcss-loader',
            },
        ]
    },

    resolve: {
        //tells webpack where to look for modules
        // TODO Use this from environ
        modulesDirectories: ['../node_modules'],
        //extensions that should be used to resolve modules
        extensions: ['', '.js', '.jsx']
    }
}
