const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}

module.exports = {
    mode: 'development',
    // mode: 'production',
    devtool: 'source-map',
    watchOptions: {
        poll: true,
        ignored: /node_modules/
    },
    optimization: {
        usedExports: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'public/js/bb-data-app.bundle',
                    chunks: 'all'
                },
                styles: {
                    name: 'styles',
                    test: (m, c, entry = 'styles') =>
                        m.constructor.name === 'CssModule' &&
                        recursiveIssuer(m) === entry,
                    chunks: 'all',
                    enforce: true
                }
            }
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                cache: true,
                sourceMap: true,
                terserOptions: {
                    ecma: 6,
                    compress: true,
                    output: {
                        comments: false,
                        beautify: false
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    entry: {
        'public/js/bb-data-app.bundle': './client/ts/bb-data-app.ts',
        'public/css/bb-data-app.min': './client/scss/styles.scss'
    },
    output: {
        path: path.resolve(__dirname, ''),
        sourceMapFilename: '[name].map'
    },
    resolve: {
        plugins: [
            new TsconfigPathsPlugin({
                configFile: './tsconfig.json'
            })
        ],
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.js']
    },
    module: {
        strictThisContextOnImports: true,
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.svg$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: '/public/imgs'
                    }
                }]
            },
            {
                test: /\.(eot|woff|woff2|svg|otf|ttf)([\?]?.*)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        // outputPath: path.resolve(__dirname, 'app/_resources/css/webfonts'),
                        publicPath: '/vendors/fa/css/webfonts'
                    }
                }]
            },
            {
                test: /\.(png|woff|woff2|eot|otf|ttf|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 100000,
                        outputPath: path.resolve(
                            __dirname,
                            'vendor/fa/webfonts'
                        )
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new BrowserSyncPlugin({
            // browse to http://localhost:5000/ during development,
            // ./public directory is being served
            host: 'localhost',
            port: 3000,
            open: false,
            proxy: 'http://localhost:5000/',
            // server: {
            //     baseDir: ['public']
            // },
            files: [
                './public/*.html',
                './public/*.css'
            ]
        }, {
            reload: true,
            // injectCss: true
        })
    ]
};