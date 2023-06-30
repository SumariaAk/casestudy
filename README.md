# Case Study - 3006 

This case study is an event-driven architecture that reads a text file and stores its contents in a document database. The data is then displayed on the frontend, and upon user request, it can be converted to CSV format and delivered as a downloadable URL.

## Table of Contents

- [Case Study - 3006](#case-study---3006)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Architecture Overview](#architecture-overview)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [API Documentation](#api-documentation)
  - [GitHub Actions](#github-actions)
    - [Secrets](#secrets)
    - [Variables](#variables)
  - [Installation and Usage](#installation-and-usage)
  - [Unit Testing](#unit-testing)
  - [License](#license)

## Introduction

This project is a web application that utilizes a React.js frontend and a serverless backend built with the Serverless Framework and Node.js. The frontend interacts with the backend through API calls to retrieve data from a DynamoDB database and to generate a downloadable CSV file.

## Architecture Overview

The architecture of this project follows an event-driven pattern, which consists of the following components:
1. File Upload: When a text file is uploaded, it triggers an event.
2. Event Trigger: The event trigger component captures the file upload event and initiates further processing.
3. File Processor: The file processor component reads the contents of the uploaded file and stores it in a document database
4. Frontend: The frontend component displays the data retrieved from the document database.
5. CSV Conversion: Upon user request, the backend converts the stored data into CSV format.
6. Downloadable URL: The backend generates a downloadable URL for the converted CSV file, which can be provided to the user.

## Frontend

The frontend of the application is built using React.js. It makes an API call to the backend when the page loads to fetch data from the DynamoDB database. Additionally, there is a download button that triggers an API call to the backend to generate a CSV file and retrieve a downloadable link.
Used serverless-finch plugin

## Backend

The backend is built using the Serverless Framework and Node.js. It consists of three Lambda functions:

1. **Upload Function**: This function is triggered when a text file is uploaded to an S3 bucket. It saves the data from the text file into the DynamoDB database.

2. **Get Function**: This function serves as a GET API endpoint that retrieves data from the DynamoDB database and returns it as a response.

3. **CSV Function**: This function serves as another GET API endpoint that fetches data from the DynamoDB database, converts it into a CSV file, saves the CSV file in an S3 bucket, and returns a downloadable link to the CSV file.

## API Documentation

The API documentation, including the available endpoints and their descriptions, can be found in the [Postman Collection](https://documenter.getpostman.com/view/18012753/2s93z5Ak75#3ccf505a-bf62-44d4-bfd0-b1327f07ed4b) file.


## GitHub Actions

A GitHub Actions workflow has been set up to trigger on every push to the main branch. This workflow automatically builds and deploys the application, runs the unit tests, and generates a code coverage report.

### Secrets
1. The AWS account ID where you want to host the project.

```
AWS_ACCOUNT_ID
```

2. Serverless framework access key from [SERVERLESS_ACCESS_KEY](https://www.serverless.com/framework/docs/guides/cicd/running-in-your-own-cicd)

```
SERVERLESS_ACCESS_KEY
```

### Variables
Serverless framework application name
```
APP_NAME
```
Serverless framework organization name 
```
ORG_NAME
```
DynamoDb table name
```
DYNAMODB_TABLE_NAME
```
S3 Bucket name where text file is dropped
```
SOURCE_S3_BUCKET_NAME
```
S3 Bucket name where csv file is stored
```
TARGET_S3_BUCKET_NAME
```
S3 Bucket name where frontend web app is deployed
```
HOST_S3_BUCKET_NAME
```
AWS account ID
```
ACCOUNT_ID
```

## Installation and Usage

To set up the project locally, follow these steps:

1. Clone the repository: 

```
`git clone https://github.com/SumariaAk/.git`
```
1. Install dependencies in client, client/my-app and server folders
2. Create .env files in server and client folder with below variables

server/.env

```
        APP_NAME={serverless framework application name} 
        ORG_NAME={serverless framework organization name}
        DYNAMODB_TABLE_NAME={AWS DynamoDB table name}
        SOURCE_S3_BUCKET_NAME={AWS S3 source name}
        TARGET_S3_BUCKET_NAME={AWS S3 target name}
        ACCOUNT_ID={AWS account ID}
```
client/.env

```
        APP_NAME={serverless framework application name}
        ORG_NAME={serverless framework organization name}
        DYNAMODB_TABLE_NAME={AWS DynamoDB table name}
        HOST_S3_BUCKET_NAME={AWS S3 host name}
        ACCOUNT_ID={AWS account ID}
```

3. Run below command in server folder to deploy the backend

```
serverless deploy
```

4. Run below command in client folder to build the client

```
serverless client build
```

5. Run below command in client folder to deploy the client

```
serverless client deploy
```


## Unit Testing

The backend is unit tested using the Jest framework. The test cases ensure the correctness and reliability of the Lambda functions.
Run test case 'npm test' in server folder

## License

This project is licensed under the [MIT License](LICENSE).