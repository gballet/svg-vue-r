// Karma configuration
var webpackConfig = require("./webpack.config.js");

module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ["mocha"],

    // ... normal karma configuration
    files: [
      // all files ending in "-test"
      {pattern: 'test/*-test.js', watched: false},
      {pattern: 'test/**/*-test.js', watched: false}
      // each file acts as entry point for the webpack configuration
    ],

    preprocessors: {
      // add webpack as preprocessor
      'test/*-test.js': ['webpack'],
      'test/**/*-test.js': ['webpack']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      noInfo: true
    },

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-phantomjs-launcher")
    ],

    browsers: ["PhantomJS"],

    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    }
  });
};
