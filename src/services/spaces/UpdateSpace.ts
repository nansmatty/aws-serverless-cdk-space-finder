import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function updateSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
	if (event.queryStringParameters && 'id' in event.queryStringParameters && event.body) {
		const spaceId = event.queryStringParameters['id'];
		const requestBodyKey = Object.keys(event.body)[0];
		const requestBodyValue = event.body[requestBodyKey];

		const updatedResult = await ddbClient.send(
			new UpdateItemCommand({
				TableName: process.env.SPACES_TABLE_NAME || '',
				Key: marshall({ id: spaceId }),
				UpdateExpression: `SET #spacekey = :value`,
				ExpressionAttributeValues: marshall({
					':value': requestBodyValue,
				}),
				ExpressionAttributeNames: {
					'#spacekey': requestBodyKey,
				},
				ReturnValues: 'UPDATED_NEW',
			})
		);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Space updated successfully',
				result: JSON.stringify(unmarshall(updatedResult.Attributes || {})),
			}),
		};
	}

	return {
		statusCode: 404,
		body: JSON.stringify({
			message: 'Missing required query parameter or body',
		}),
	};
}
