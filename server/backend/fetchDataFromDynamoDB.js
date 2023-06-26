const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME, // Name of the DynamoDB table to scan
    };

    // Scan the DynamoDB table and retrieve the items
    const { Items } = await dynamoDb.scan(params).promise();

    // Sort the data based on the "id" field
    const sortedData = Items.sort((a, b) => a.id - b.id);

    // Return the sorted data as the response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Set the appropriate origin here or restrict it to specific origins
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sortedData), // Convert the sorted data to JSON string
    };
  } catch (error) {
    return { statusCode: 500, body: 'Error fetching data from DynamoDB' };
  }
};

