const { handler } = require('../backend/fetchDataFromDynamoDB');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();


jest.mock('aws-sdk', () => {
    const dynamoDb = {
      scan: jest.fn().mockReturnThis(),
      promise: jest.fn(),
    };
  
    return {
      DynamoDB: {
        DocumentClient: jest.fn(() => dynamoDb),
      },
    };
});

test('should return sorted data from DynamoDB', async () => {
  // Mock the DynamoDB scan response
  const mockData = {
    Items: [
      {
        id: 1,
        first_name: 'Beryle',
        last_name: 'Denzilow',
        email: 'bdenzilow0@buzzfeed.com',
        gender: 'Female',
        ip_address: '206.112.181.203',
      },
      {
        id: 2,
        first_name: 'Auberta',
        last_name: 'Fritschmann',
        email: 'afritschmann1@pcworld.com',
        gender: 'Female',
        ip_address: '251.48.161.108',
      },
    ],
  };
  dynamoDb.scan().promise.mockResolvedValue(mockData);

  // Invoke the handler
  const result = await handler({});

  // Verify the response
  expect(result.statusCode).toBe(200);
  expect(result.body).toBe(
    JSON.stringify(mockData.Items.sort((a, b) => a.id - b.id))
  );
});

  
  test('should return an error response when fetching data from DynamoDB fails', async () => {
    // Mock the DynamoDB scan response to simulate an error
    const mockError = new Error('Error fetching data from DynamoDB');
    dynamoDb.scan().promise.mockRejectedValue(mockError);
  
    // Invoke the handler
    const result = await handler({});
  
    // Verify the error response
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe('Error fetching data from DynamoDB');
  });
  
  