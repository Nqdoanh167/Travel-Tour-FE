/** @format */
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
   images: {
      domains: ['res.cloudinary.com'],
   },
   webpack: (config) => {
      config.module.rules.push({
         test: /\.(mp4|webm)$/,
         use: {
            loader: 'file-loader',
            options: {
               publicPath: '/_next/static/videos/',
               outputPath: 'static/videos/',
               name: '[name].[hash].[ext]',
            },
         },
      });

      return config;
   },
   env: {
      BASE_URL: process.env.BASE_URL,
   },
};
