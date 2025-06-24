const path = require('path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = react_blueprints => (env, options) => {
    const mode = options.mode || 'development';

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
			extensions: ['.js', '.jsx', '.json'],
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
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                    test: /\.css$/i,
                    include: path.resolve(__dirname, './'),
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(png|jp(e*)g|svg|gif|pdf)$/,
                    type: 'asset/resource'
                }
            ]
        },
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
	var now = Date.now();
    for (let i = 0; i < react_blueprints.length; i++) {

        let { src_files, dest_path } = react_blueprints[i];

		// Convert rel path to absolute
		dest_path = path.resolve(process.cwd(), dest_path);
		if ( ! fs.existsSync( dest_path ) ) {
			fs.mkdirSync(dest_path, {recursive: true});
		}

		for (let k in src_files) {
			src_files[k] = path.resolve( process.cwd(), src_files[k]);
		}
		
        configEditors.push(
            Object.assign({}, config, {
                name: 'configEditor',
                entry: src_files,
                output: {
                    path: path.resolve(dest_path),
                    filename: `[name].${now}.js`
                }
            })
        );
    }

    return [...configEditors];
};
