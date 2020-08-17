const AWSAppSyncClient = require('aws-appsync').default
const { AUTH_TYPE } = require('aws-appsync')

console.log(process.env.VUE_APP_AWS_APPSYNC_GRAPHQLENDPOINT)

const client = new AWSAppSyncClient({
  url: process.env.VUE_APP_AWS_APPSYNC_GRAPHQLENDPOINT,
  region: process.env.VUE_APP_AWS_APPSYNC_REGION,
  auth: {
    type: AUTH_TYPE.API_KEY, // or type: awsconfig.aws_appsync_authenticationType,
    apiKey: process.env.VUE_APP_AWS_APPSYNC_APIKEY,
  },
  disableOffline: true,
})

export default client
