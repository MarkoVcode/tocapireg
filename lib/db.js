const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { DeleteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const env = require('./env');
env.processEnvironment();

const TABLE_NAME = process.env.REGISTRY_TABLE;
const client = new DynamoDBClient(env.getDBSettings());
const docClient = DynamoDBDocumentClient.from(client);

const queryItemByIndex = async (indexName, keyConditionExpression, expressionAttributeValues) => {
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
}

const fetchPublishedModels = async (published) => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: 'published = :published',
        ExpressionAttributeValues: {
            ':published': { BOOL: published }
        }
    };
    const command = new ScanCommand(params);
    const response = await docClient.send(command);
    const unmarshalled = response.Items?.map((i) => unmarshall(i));
    return unmarshalled;
}

const queryItemsByServiceUrl = async (serviceUrl) => {
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
const addItem = async (modelItem) => {
    const params = {
        TableName: TABLE_NAME,
        Item: {
            serviceUrl: modelItem.serviceUrl,
            id: modelItem.id,
            ...modelItem,
        },
        ReturnValues: 'ALL_OLD'
    };
    const command = new PutCommand(params);
    const response = await docClient.send(command);
    return response.Attributes ? true : false;
};

const deleteItem = async (id, serviceUrl) => {
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

const deleteItemsByServiceUrl = async (serviceUrl) => {
    let deletedCounter = 0;
    const items = await queryItemsByServiceUrl(serviceUrl);
    for (const item of items) {
        await deleteItem(item.id, serviceUrl);
        deletedCounter++;
    }
    return deletedCounter;
};


module.exports = {
    queryItemByIndex,
    fetchPublishedModels,
    queryItemsByServiceUrl,
    addItem,
    deleteItem,
    deleteItemsByServiceUrl,
};