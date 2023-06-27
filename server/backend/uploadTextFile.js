const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    // Extract bucket name and object key from the event records
    const s3Object = event.Records[0].s3;
    const bucketName = s3Object.bucket.name;
    const objectKey = s3Object.object.key;

    // Download the text file from S3
    const textFileContent = await downloadTextFile(bucketName, objectKey);

    // Parse the text file content and extract data into an array of objects
    const dataArray = parseTextFileContent(textFileContent);

    // Save the data to DynamoDB
    await Promise.all(dataArray.map((data) => saveDataToDynamoDB(data)));
    return { statusCode: 200, body: 'Data saved to DynamoDB' };
  } catch (error) {
    return { statusCode: 500, body: 'Error saving data to DynamoDB' };
  }
};

// Download the text file from S3
async function downloadTextFile(bucketName, objectKey) {
  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  // Retrieve the text file content from S3
  const { Body } = await s3.getObject(params).promise();
  return Body.toString();
}

// Save data to DynamoDB
async function saveDataToDynamoDB(data) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME, // Name of the DynamoDB table to save data to
    Item: data, // Data to be saved
  };
  await dynamoDb.put(params).promise();
}

// Parse the text file content and extract data into an array of objects
function parseTextFileContent(textFileContent) {
  const lines = textFileContent.trim().split('\n');
  const headers = lines.shift().split('\t');

  return lines.map((line) => {
    const values = line.split('\t');
    const data = {};

    for (let i = 0; i < headers.length; i++) {
      data[headers[i]] = values[i];
    }

    return data;
  });
}
