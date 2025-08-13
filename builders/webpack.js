const path = require('path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = react_blueprints => (env, options) => {

    const mode = options.mode || 'development';
    const now = Date.now();

    const config = {
        mode,
        snapshot: {
            managedPaths: [path.resolve(process.cwd(), '../node_modules')],
            immutablePaths: [],
            buildDependencies: {
                hash: true,
                timestamp: true,
            },
            module: {
                timestamp: true,
            },
            resolve: {
                timestamp: true,
            },
            resolveBuildDependencies: {
                hash: true,
                timestamp: true,
            },
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.scss', '.sass', '.css'],
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel-loader',
                    options: { presets: ['@babel/env', '@babel/preset-react'] }
                },
                {
                    test: /\.(s(a|c)ss)$/,
                    use: [
                        mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader', 
                        'sass-loader'
                    ]
                },
                {
                    test: /\.css$/i,
                    include: path.resolve(__dirname, './'),
                    use: [
                        mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.(png|jp(e*)g|svg|gif|pdf)$/,
                    type: 'asset/resource'
                }
            ]
        },
		plugins: [
			new MiniCssExtractPlugin({
				filename: `[name].${now}.css`
			})
		],
        devtool: 'source-map'
    };

    if ('production' === mode) {
        config.devtool = false;
        config.optimization = {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comments: false
                        }
                    },
                    extractComments: false
                })
            ]
        };
    }

    var configEditors = [];
    
    for (let i = 0; i < react_blueprints.length; i++) {
        let { src_files, dest_path } = react_blueprints[i];

        // Convert rel path to absolute
        dest_path = path.resolve(process.cwd(), dest_path);
        if (!fs.existsSync(dest_path)) {
            fs.mkdirSync(dest_path, { recursive: true });
        }

        // Separate JS and SCSS files
        const jsEntries = {};
        const scssEntries = {};

        for (let k in src_files) {
            const srcPath = path.resolve(process.cwd(), src_files[k]);
            const ext = path.extname(srcPath);
            
            if (ext === '.scss' || ext === '.sass') {
                scssEntries[k] = srcPath;
            } else {
                jsEntries[k] = srcPath;
            }
        }

        // Create JS configuration if there are JS files
        if (Object.keys(jsEntries).length > 0) {
            configEditors.push(
                Object.assign({}, config, {
                    name: `jsConfig_${i}`,
                    entry: jsEntries,
                    output: {
                        path: path.resolve(dest_path),
                        filename: `[name].${now}.js`
                    }
                })
            );
        }

        // Create SCSS configuration if there are SCSS files
        if (Object.keys(scssEntries).length > 0) {
            const scssConfig = Object.assign({}, config, {
                name: `scssConfig_${i}`,
                entry: scssEntries,
                output: {
                    path: path.resolve(dest_path),
                    filename: `[name].${now}.js` // This won't be used since we're only extracting CSS
                },
                plugins: [
                    ...config.plugins,
                    new MiniCssExtractPlugin({
                        filename: `[name].${now}.css`
                    }),
                    // Remove the JS files and source maps that webpack generates for CSS-only entries
                    {
                        apply: (compiler) => {
                            compiler.hooks.emit.tapAsync('RemoveJSFromCSSOnlyEntries', (compilation, callback) => {
                                Object.keys(scssEntries).forEach(entryName => {
                                    const jsFileName = `${entryName}.${now}.js`;
                                    const jsMapFileName = `${entryName}.${now}.js.map`;
                                    
                                    if (compilation.assets[jsFileName]) {
                                        delete compilation.assets[jsFileName];
                                    }
                                    if (compilation.assets[jsMapFileName]) {
                                        delete compilation.assets[jsMapFileName];
                                    }
                                });
                                callback();
                            });
                        }
                    }
                ],
                module: {
                    ...config.module,
                    rules: config.module.rules.map(rule => {
                        if (rule.test && rule.test.toString().includes('s(a|c)ss')) {
                            return {
                                ...rule,
                                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                            };
                        }
                        return rule;
                    })
                }
            });
            
            configEditors.push(scssConfig);
        }
    }

    return [...configEditors];
};