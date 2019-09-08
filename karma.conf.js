const webpackConfig = require('./webpack.config');

module.exports = function (config) {
    config.set({
        basePath: '',
        exclude: [],
        files: [
            { pattern: 'test/**/*.tsx', watched: true, served: true, included: true }
            /*parameters:
                watched: if autoWatch is true all files that have set watched to true will be watched for changes
                served: should the files be served by Karma's webserver?
                included: should the files be included in the browser using <script> tag?
                nocache: should the files be served from disk on each request by Karma's webserver? */
            /*assets:
                {pattern: '*.html', watched:true, served:true, included:false}
                {pattern: 'images/*', watched:false, served:true, included:false} */
        ],
        autoWatch: true,
        singleRun: false,
        failOnEmptyTestSuite: false,
        logLevel: config.LOG_WARN, //config.LOG_DISABLE, config.LOG_ERROR, config.LOG_INFO, config.LOG_DEBUG
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'/*,'Chrome','Firefox','Edge','ChromeCanary','Opera','IE','Safari'*/],
        reporters: ['progress'/*, 'kjhtml','dots','mocha','spec'*/],
        listenAddress: '0.0.0.0',
        hostname: 'localhost',
        port: 9876,
        retryLimit: 0,
        browserDisconnectTimeout: 5000,
        browserNoActivityTimeout: 10000,
        captureTimeout: 60000,

        client: {
            captureConsole: false,
            clearContext: false,
            runInParent: false,
            useIframe: true,
            jasmine: {
                random: false
            }
        },
        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },
        preprocessors: {
            "test/**/*.tsx": ["webpack"]
        },
        plugins: [
            require('karma-jasmine'),
            require("karma-coverage"),
            require('karma-phantomjs-launcher'),
            require('karma-webpack'),
            require('karma-sourcemap-loader'),
            require('ts-loader'),
            require('karma-coverage')
        ],
        mime: {
            'text/x-typescript': ['ts','tsx']
        },
        webpackMiddleware: {
            noInfo: true,
            stats: 'errors-only'
        },
        mochaReporter: {
            output: 'noFailures'  //full, autowatch, minimal
        }
    });
};
