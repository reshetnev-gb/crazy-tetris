import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import includePaths from 'rollup-plugin-includepaths';
import postcssNesting from 'postcss-nesting';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        includePaths({
            paths: ['src'],
            extensions: ['.json', '.ts', '.tsx']
        })
    ],
    css: {
        modules: {
            localsConvention: 'camelCaseOnly'
        },
        postcss: {
            plugins: [postcssNesting]
        }
    }
});
