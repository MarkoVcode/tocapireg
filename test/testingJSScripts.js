const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const scanTable = async () => {
    const params = {
        TableName: 'tocModelsRegistry',
    };

    const command = new ScanCommand(params);
    const response = await docClient.send(command);
    console.log(response);
    return response.Items;
};

// Example usage
const main = async () => {
    try {
        const items = await scanTable();
        console.log(items);
    } catch (error) {
        console.error(error);
    }
};

main();