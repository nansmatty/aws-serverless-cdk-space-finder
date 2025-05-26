import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 } from 'uuid';
import { validateSpaceEntry } from '../shared/DataValidator';

export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
	const randomId = v4();
	const item = JSON.parse(event.body || '{}');

	item.id = randomId;
	validateSpaceEntry(item);

	//without marshalling, the item will look like this:
	// Item: {
	// 	id: { S: randomId },
	// 	location: { S: item.location },
	// },

	// with marshalling, the item will look like this:
	// marshall({
	// 	id: randomId,
	// 	location: item.location,
	// }),

	const result = await ddbClient.send(
		new PutItemCommand({
			TableName: process.env.SPACES_TABLE_NAME || '',
			Item: marshall(item),
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
