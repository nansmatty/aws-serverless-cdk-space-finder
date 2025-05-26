import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function updateSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
	if (event.queryStringParameters && 'id' in event.queryStringParameters && event.body) {
		const parsedBody = JSON.parse(event.body);
		const spaceId = event.queryStringParameters['id'];
		const requestBodyKey = Object.keys(parsedBody)[0];
		const requestBodyValue = parsedBody[requestBodyKey];

		const updatedResult = await ddbClient.send(
			new UpdateItemCommand({
				TableName: process.env.SPACES_TABLE_NAME,
				Key: { id: { S: spaceId } },
				UpdateExpression: 'SET #spacekey = :newvalue',
				ExpressionAttributeValues: {
					':newvalue': { S: requestBodyValue },
				},
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
				result: JSON.stringify(unmarshall(updatedResult.Attributes)),
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
