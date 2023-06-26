# Case study

This case study is an event-driven architecture that reads a text file and stores its contents in a document database. The data is then displayed on the frontend, and upon user request, it can be converted to CSV format and delivered as a downloadable URL.

## Table of Contents

- [Case study](#case-study)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Architecture Overview](#architecture-overview)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [API Documentation](#api-documentation)
  - [GitHub Actions](#github-actions)
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
This actions requires the following secrets
1. AWS_ACCOUNT_ID - The AWS account ID where you want to host the project.
2. SERVERLESS_ACCESS_KEY - Serverless framework access key. 

## Installation and Usage

To set up the project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/SumariaAk/serverlessproject.git`
2. Install dependencies in client, client/my-app and server folders
3. Create .env files in server and client folder with below variables
4. 
   server/.env
        APP_NAME={serverless framework application name} 
        ORG_NAME={serverless framework organization name}
        DYNAMODB_TABLE_NAME={AWS DynamoDB table name}
        SOURCE_S3_BUCKET_NAME={AWS S3 source name}
        TARGET_S3_BUCKET_NAME={AWS S3 target name}
        ACCOUNT_ID={AWS account ID}

    client/.env
        APP_NAME={serverless framework application name}
        ORG_NAME={serverless framework organization name}
        DYNAMODB_TABLE_NAME={AWS DynamoDB table name}
        HOST_S3_BUCKET_NAME={AWS S3 host name}
        ACCOUNT_ID={AWS account ID}
        
5. Run 'serverless deploy'  in server folder to deploy the backend
6. Run 'serverless client build' in client folder to build the client
7. Run 'serverless client deploy' in client folder to deploy the client

## Unit Testing

The backend is unit tested using the Jest framework. The test cases ensure the correctness and reliability of the Lambda functions.
Run test case 'npm test' in server folder

## License

This project is licensed under the [MIT License](LICENSE).