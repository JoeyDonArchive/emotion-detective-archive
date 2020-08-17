# Emotion-detective-Web-App

This is a solution regarding **KPMG Technical Test**

## Staging link

#### https://d1fgqfm08fhcx.cloudfront.net

## Project setup

#### 1. Install all dependecies

```
npm install
```

#### 2. Compiles and hot-reloads for development

```
npm run serve
```

#### 3. Compiles and minifies for staging/production

```
npm run build
```

## ⚠ Videos has to be uploaded directly to the S3 bucket in AWS Console

S3 Bucket: `staging-emotion-detective-raw-video`
As I wanted to keep the prototype simple so S3 Multi-Part uploading isn't implemented in the front-end. In the production, I would implement this feature via AWK Amplify SDK with authentications with Cognito.
After the manual upload, you can launch tasks from this Web App.

## The Brief

I spent roughly 6 hours in the Front-end.

- UI Layout: Following the best User Experiences practice.
- Tech Stack: Sass / Html5 / JavaScript
- Extra Libraries: Aws-amplify / Aws-appsync / GraphQL
- Framework: Vue.js (created from CLI)

## My Road Map

### 1. Create this project from my earlier prototype.

1.1 Clean the codes and components.

1.2 List the things needs to be done or re-work.

### 2. Remap the AppSync(GraphQL) Endpoints

2.1 All the data fetching is via GraphQL queries, e.g. listing videos, listing clients/projects.

2.2 All the data changing is via GraphQL mutations, e.g. creating clients/projects, adding videos to peojects.

### 3. Remap the APIGateway Endpoints

3.1 The Launch action is sending a POST request to APIGateway so triggering the Lambda that starts the Stepfunction for further processing orchestration.

### 4. Testing

### 5. This README File.
