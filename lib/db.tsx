import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

//const TABLE_NAME = 'tocModelsRegistry';
const TABLE_NAME = 'tocModelsRegistry-development';

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const scanTable = async () => {
    const params = {
        TableName: TABLE_NAME,
    };
    const command = new ScanCommand(params);
    const response = await docClient.send(command);
    const unmarshalled = response.Items?.map((i) => unmarshall(i));
    return unmarshalled;
};

export const queryItemByIndex = async (indexName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, string>) => {
    const params = {
        TableName: TABLE_NAME,
        IndexName: indexName, //'modelId',
        KeyConditionExpression: keyConditionExpression, //'modelId = :modelId',
        ExpressionAttributeValues: expressionAttributeValues, //{':modelId': '0000'},
    }
    const command = new QueryCommand(params);
    const response = await docClient.send(command);
    return response.Items?.[0];
    //response.Items.map(item => unmarshall(item));
};

export const queryItemsByServiceUrl = async (serviceUrl: string) => {
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'serviceUrl = :serviceUrl',
        ExpressionAttributeValues: {
            ':serviceUrl': serviceUrl
        },
    };
    const command = new QueryCommand(params);
    const response = await docClient.send(command);
    return response.Items;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */   
export const addItem = async (modelItem: any) => {
    const params = { 
        TableName: TABLE_NAME,
        Item: {
            serviceUrl: modelItem.serviceUrl,
            id: modelItem.id,
            ...modelItem,
        },
    };
    const command = new PutCommand(params);
    await docClient.send(command);
};

export const deleteItem = async (id: string, serviceUrl: string) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            serviceUrl: serviceUrl,
            id: id,
        },
    };
    const command = new DeleteCommand(params);
    await docClient.send(command);
};