const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg)$/,
                use: 'file-loader'
            },
            {
                test: /\.(glsl|vert|frag)$/,
                use: ['glslify-import-loader', 'raw-loader', 'glslify-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin()
    ]
};