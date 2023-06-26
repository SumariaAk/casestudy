const { handler, fetchDataFromDynamoDB, convertToCSV, getSignedUrl } = require('../backend/generateCSV');
const AWS = require('aws-sdk');

jest.mock('aws-sdk', () => {
    const mockDynamoDbScan = jest.fn().mockReturnThis();
    const mockDynamoDbPromise = jest.fn();
    const mockDynamoDb = {
      scan: mockDynamoDbScan,
    };
    mockDynamoDbScan.mockReturnValue({ promise: mockDynamoDbPromise });
    const mockS3GetSignedUrlPromise = jest.fn();
    const mockS3 = {
      upload: jest.fn().mockReturnThis(),
      getSignedUrlPromise: mockS3GetSignedUrlPromise,
    };
    const mockS3UploadPromise = jest.fn();
    mockS3.upload.mockReturnValue({ promise: mockS3UploadPromise });
  
    return {
      DynamoDB: {
        DocumentClient: jest.fn(() => mockDynamoDb),
      },
      S3: jest.fn(() => mockS3),
    };
  });

  test('should generate and upload CSV file to S3 and return signed URL', async () => {
    const mockData = [
      { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', gender: 'Male', ip_address: '127.0.0.1' },
      // Add more mock data as needed
    ];
  
    // Mock DynamoDB scan response
    const mockScanResponse = { Items: mockData };
    AWS.DynamoDB.DocumentClient().scan().promise.mockResolvedValue(mockScanResponse);
  
    // Mock S3 upload response
    const mockS3UploadResponse = { Location: 'https://s3.amazonaws.com/bucket/data.csv' };
    AWS.S3().upload().promise.mockResolvedValue(mockS3UploadResponse);
  
    // Mock S3 getSignedUrl response
    const mockSignedUrl = 'https://s3.amazonaws.com/bucket/data.csv';
    AWS.S3().getSignedUrlPromise.mockResolvedValue(mockSignedUrl);
  
    // Invoke the handler
    const result = await handler({});
  
    // Verify the response
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(mockSignedUrl);
  });
  
  test('should return an error response when fetching data from DynamoDB fails', async () => {
    const mockError = new Error('Error fetching data from DynamoDB');
  
    // Mock DynamoDB scan response to simulate an error
    AWS.DynamoDB.DocumentClient().scan().promise.mockRejectedValue(mockError);
  
    // Invoke the handler
    const result = await handler({});
  
    // Verify the error response
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe('Error generating CSV file');
  });
  