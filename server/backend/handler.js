'use strict';

exports.handler = async (event) => {
  console.log('inside hello printing');
  return {
    statusCode: 200,
    body: JSON.stringify(
      'hello world'
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};