const { handler, downloadTextFile, saveDataToDynamoDB, parseTextFileContent } = require('../backend/uploadTextFile');
const AWS = require('aws-sdk');


jest.mock('aws-sdk', () => {
    const mockGetObjectPromise = jest.fn();
    const mockGetObject = jest.fn().mockReturnThis();
    mockGetObject.mockReturnValue({ promise: mockGetObjectPromise });
    const mockPutPromise = jest.fn();
    const mockPut = jest.fn().mockReturnThis();
    mockPut.mockReturnValue({ promise: mockPutPromise });
    const mockS3 = {
      getObject: mockGetObject,
    };
    const mockDynamoDb = {
      put: mockPut,
    };
  
    return {
      S3: jest.fn(() => mockS3),
      DynamoDB: {
        DocumentClient: jest.fn(() => mockDynamoDb),
      },
    };
});

  
  test('should download text file from S3, parse content, and save data to DynamoDB', async () => {
    const mockBucketName = 'test-bucket';
    const mockObjectKey = 'test-object.txt';
    const mockTextFileContent = 'id\tname\n1\tJohn\n2\tJane\n';
  
    // Mock S3 getObject response
    const mockGetObjectResponse = { Body: Buffer.from(mockTextFileContent) };
    AWS.S3().getObject().promise.mockResolvedValue(mockGetObjectResponse);
  
    // Mock DynamoDB put response
    const mockPutResponse = {};
    AWS.DynamoDB.DocumentClient().put().promise.mockResolvedValue(mockPutResponse);
  
    // Invoke the handler
    const mockEvent = {
      Records: [
        {
          s3: {
            bucket: { name: mockBucketName },
            object: { key: mockObjectKey },
          },
        },
      ],
    };
    const result = await handler(mockEvent);
  
    // Verify the response
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe('Data saved to DynamoDB');
  
    // Verify the function calls
    expect(AWS.S3().getObject).toHaveBeenCalledWith({ Bucket: mockBucketName, Key: mockObjectKey });
    expect(AWS.DynamoDB.DocumentClient().put).toHaveBeenCalledTimes(3); // Adjust the number of expected function calls
    expect(AWS.DynamoDB.DocumentClient().put).toHaveBeenCalledWith(expect.any(Object));
  });
  
  test('should return an error response when downloading text file from S3 fails', async () => {
    const mockBucketName = 'test-bucket';
    const mockObjectKey = 'test-object.txt';
    const mockError = new Error('Error downloading text file from S3');
  
    // Mock S3 getObject response to simulate an error
    AWS.S3().getObject().promise.mockRejectedValue(mockError);
  
    // Invoke the handler
    const mockEvent = {
      Records: [
        {
          s3: {
            bucket: { name: mockBucketName },
            object: { key: mockObjectKey },
          },
        },
      ],
    };
    const result = await handler(mockEvent);
  
    // Verify the error response
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe('Error saving data to DynamoDB');
  });
  