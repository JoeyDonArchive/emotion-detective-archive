const { SSM } = require('aws-sdk')
const merge = require('lodash.merge')

const trim = (string, charlist) => {
    return string.trimLeft(charlist).trimRight(charlist)
}

const objectify = (key, value) => {
    let result = object = {}
    let arr = key.split('.')
    for (let i = 0; i < arr.length - 1; i++) {
        object = object[arr[i]] = {}
    }
    object[arr[arr.length - 1]] = value
    return result
}

const injectSSmParameters = async ({ accessKeyId, secretAccessKey, region, path }) => {
    const ssm = new SSM({ accessKeyId, secretAccessKey, region })
    const paramsList = await ssm.getParametersByPath({ Path: path, Recursive: true }).promise()
    
    let paramsObj = {}
    paramsList.Parameters.forEach(param => {
        let key = trim(param.Name.replace(path, ''), '/').replace('/', '.')
        let value = param.Value
        paramsObj = merge(paramsObj, objectify(key, value))
    })

    process.env.VUE_APP_SSM = JSON.stringify(paramsObj)
    return Promise.resolve(paramsObj)
}

module.exports = (api, options) => {
    api.registerCommand('build:async', async (args) => {
        if (
            typeof process.env.SSM_ACCESSKEYID !== 'undefined' &&
            typeof process.env.SSM_SECRETACCESSKEY !== 'undefined' &&
            typeof process.env.SSM_REGION !== 'undefined' &&
            typeof process.env.SSM_PATH !== 'undefined'
        ) {
            await injectSSmParameters({
                accessKeyId: process.env.SSM_ACCESSKEYID,
                secretAccessKey: process.env.SSM_SECRETACCESSKEY,
                region: process.env.SSM_REGION,
                path: process.env.SSM_PATH
            })
        }

        await api.service.run('build', args)
    })
    api.registerCommand('serve:async', async (args) => {
        if (
            typeof process.env.SSM_ACCESSKEYID !== 'undefined' &&
            typeof process.env.SSM_SECRETACCESSKEY !== 'undefined' &&
            typeof process.env.SSM_REGION !== 'undefined' &&
            typeof process.env.SSM_PATH !== 'undefined'
        ) {
            await injectSSmParameters({
                accessKeyId: process.env.SSM_ACCESSKEYID,
                secretAccessKey: process.env.SSM_SECRETACCESSKEY,
                region: process.env.SSM_REGION,
                path: process.env.SSM_PATH
            })
        }

        await api.service.run('serve', args)
    })
}
