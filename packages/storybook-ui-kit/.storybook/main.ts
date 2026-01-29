import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";

const config: StorybookConfig = {
    stories: [
        "../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
    ],
    framework: {
        name: "@storybook/react-webpack5",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    babel: async (options) => ({
        ...options,
        presets: [
            ...(options.presets || []),
            '@babel/preset-typescript',
        ],
    }),
    webpackFinal: async (config) => {
        // Resolve aliases for React Native Web
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            "@float.js/native": "react-native-web",
            "react-native$": "react-native-web",
            "react": path.resolve(__dirname, "../node_modules/react"),
            "react-dom": path.resolve(__dirname, "../node_modules/react-dom"),
        };

        // Add polyfills/fallbacks for webpack 5
        config.resolve.fallback = {
            ...(config.resolve.fallback || {}),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "path": require.resolve("path-browserify"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "url": require.resolve("url"),
            "fs": false,
            "os": require.resolve("os-browserify/browser"),
            "vm": require.resolve("vm-browserify"),
        };

        return config;
    },
};
export default config;
