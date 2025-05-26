import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 } from 'uuid';

export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
	const randomId = v4();
	const item = JSON.parse(event.body || '{}');

	item.id = randomId;

	const result = await ddbClient.send(
		new PutItemCommand({
			TableName: process.env.SPACES_TABLE_NAME || '',
			Item: marshall({
				id: randomId,
				location: item.location,
			}),
		})
	);

	console.log({ result });

	return {
		statusCode: 201,
		body: JSON.stringify({
			message: 'Space created successfully',
		}),
	};
}
