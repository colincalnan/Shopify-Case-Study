const { parsed: localEnv } = require("dotenv").config();

const webpack = require("webpack");
const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
const shop = JSON.stringify(process.env.HOST);

module.exports = {
  webpack: (config) => {
    const env = { API_KEY: apiKey, SHOP_URL: shop };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
};