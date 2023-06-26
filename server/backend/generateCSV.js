const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    // Fetch data from DynamoDB
    const data = await fetchDataFromDynamoDB();

    // If no data found, return a 404 response
    if (data.length === 0) {
      return { statusCode: 404, body: 'No data found' };
    }

    // Convert data to CSV format
    const csvData = convertToCSV(data);
    const csvBuffer = Buffer.from(csvData, 'utf8');

    // Create an S3 client and upload the CSV file to the target S3 bucket
    const s3 = new AWS.S3();
    const uploadParams = {
      Bucket: process.env.TARGET_S3_BUCKET_NAME,
      Key: 'data.csv',
      Body: csvBuffer,
    };
    await s3.upload(uploadParams).promise();

    // Generate a signed URL for the uploaded file
    const signedUrl = await getSignedUrl(uploadParams.Bucket, uploadParams.Key);

    // Return the signed URL as the response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Set the appropriate origin here or restrict it to specific origins
        'Content-Type': 'text/plain',
      },
      body: signedUrl,
    };
  } catch (error) {
    return { statusCode: 500, body: 'Error generating CSV file' };
  }
};

// Fetch data from DynamoDB
async function fetchDataFromDynamoDB() {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME, // Name of the DynamoDB table to scan
  };

  // Scan the DynamoDB table and retrieve the items
  const { Items } = await dynamoDb.scan(params).promise();

  // Sort the data based on the "id" field
  const sortedData = Items.sort((a, b) => a.id - b.id);

  return sortedData;
}

// Convert data to CSV format
function convertToCSV(data) {
  const csvHeader = ['id', 'first_name', 'last_name', 'email', 'gender', 'ip_address'];

  const csvRecords = data.map(item => {
    return [
      item.id,
      item.first_name,
      item.last_name,
      item.email,
      item.gender,
      item.ip_address
    ].join(',');
  });

  const csvString = csvHeader.join(',') + '\n' + csvRecords.join('\n');
  return csvString;
}

// Generate a signed URL for the uploaded file
async function getSignedUrl(bucketName, objectKey) {
  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: 3600, // Expiration time in seconds
  };

  return await s3.getSignedUrlPromise('getObject', params);
}
