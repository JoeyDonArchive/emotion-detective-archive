module.exports = {
    configureWebpack: {
        externals: {
            'aws-sdk': 'AWS'
        }
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "~@/styles/variables.scss";`
            }
        }
    }
}
