const path = require('path');
const webpack = require('webpack');

module.exports = {
    stories: [
        '../src/stories/**/*.stories.mdx',
        '../src/stories/**/*.stories.@(js|jsx|ts|tsx)'
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    webpackFinal: async (config) => {
        const coreSrc = path.resolve(__dirname, '../../../packages/framework/float-js/packages/core/src');

        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            'react-native$': require.resolve('react-native-web'),
            'react': path.dirname(require.resolve('react/package.json')),
            'react-dom': path.dirname(require.resolve('react-dom/package.json')),
            '@float.js/core': path.resolve(__dirname, '../../../packages/framework/float-js/packages/core/src/index.ts'),
            '@float.js/lite': path.resolve(__dirname, '../../../packages/framework/float-js/packages/lite/src/index.ts'),
            // Mock server-side and build-time files that use Node APIs
            [path.join(coreSrc, 'server/index.js')]: path.resolve(__dirname, 'empty-module.js'),
            [path.join(coreSrc, 'server/ssr.js')]: path.resolve(__dirname, 'empty-module.js'),
            [path.join(coreSrc, 'build/index.js')]: path.resolve(__dirname, 'empty-module.js'),
            [path.join(coreSrc, 'build/transform.js')]: path.resolve(__dirname, 'empty-module.js'),
            [path.join(coreSrc, 'cli/index.js')]: path.resolve(__dirname, 'empty-module.js'),
            [path.join(coreSrc, 'ssg/index.js')]: path.resolve(__dirname, 'empty-module.js'),
        };

        config.resolve.extensionAlias = {
            '.js': ['.ts', '.js'],
            '.jsx': ['.tsx', '.jsx'],
        };

        config.resolve.fallback = {
            ...(config.resolve.fallback || {}),
            os: require.resolve('os-browserify/browser'),
            fs: false,
            path: require.resolve('path-browserify'),
            child_process: false,
            tty: require.resolve('tty-browserify'),
            net: false,
            tls: false,
            http: require.resolve('stream-http'),
            https: require.resolve('stream-http'),
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            vm: require.resolve('vm-browserify'),
            zlib: false,
            buffer: require.resolve('buffer/'),
            process: require.resolve('process/browser'),
            url: require.resolve('url/'),
            util: require.resolve('util/'),
        };

        config.plugins.push(
            new webpack.DefinePlugin({
                'process.versions': JSON.stringify({ node: '18.0.0' }),
                'process.env.NODE_ENV': JSON.stringify(config.mode || 'development'),
            })
        );
        config.plugins.push(
            new webpack.ProvidePlugin({
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer'],
            })
        );
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
                resource.request = resource.request.replace(/^node:/, '');
            })
        );
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(/^(chokidar|esbuild|fsevents|globby|fast-glob|tiny-glob|fastest-levenshtein|sqlite3)$/, (resource) => {
                resource.request = path.resolve(__dirname, 'empty-module.js');
            })
        );
        config.resolve.extensionAlias = {
            '.js': ['.ts', '.js'],
            '.jsx': ['.tsx', '.jsx'],
        };
        config.resolve.extensions.push('.web.js', '.web.jsx', '.web.ts', '.web.tsx');

        config.resolve.fallback = {
            ...(config.resolve.fallback || {}),
            os: require.resolve('os-browserify/browser'),
            fs: false,
            path: require.resolve('path-browserify'),
            child_process: false,
            tty: require.resolve('tty-browserify'),
            net: false,
            tls: false,
            http: require.resolve('stream-http'),
            https: require.resolve('stream-http'),
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            vm: require.resolve('vm-browserify'),
            zlib: false,
            buffer: require.resolve('buffer/'),
            process: require.resolve('process/browser'),
            url: require.resolve('url/'),
            util: require.resolve('util/'),
        };

        // Ignore problematic binary/Node files
        config.module.rules.push({
            test: /\.node$/,
            use: 'raw-loader',
        });
        config.module.rules.push({
            test: /\.d\.ts$/,
            loader: 'ignore-loader',
        });

        config.module.rules.push({
            test: /\.(js|jsx|ts|tsx)$/,
            loader: 'babel-loader',
            exclude: /node_modules(?!\/(react-native|@react-native|@nexovision|@float\.js))/,
            options: {
                babelrc: false,
                configFile: false,
                presets: [
                    ['@babel/preset-env', { targets: { node: 'current' } }],
                    ['@babel/preset-react', { runtime: 'automatic' }],
                    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
                ],
                plugins: ['@babel/plugin-transform-runtime']
            }
        });
        return config;
    },
};
