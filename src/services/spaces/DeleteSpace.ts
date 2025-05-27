import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { hasAdminGroup } from '../shared/Utils';

export async function deleteSpace(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
	if (!hasAdminGroup(event)) {
		return {
			statusCode: 401,
			body: JSON.stringify({
				message: 'Not authorized!',
			}),
		};
	}

	if (event.queryStringParameters && 'id' in event.queryStringParameters) {
		const spaceId = event.queryStringParameters['id'];

		await ddbClient.send(
			new DeleteItemCommand({
				TableName: process.env.SPACES_TABLE_NAME,
				Key: { id: { S: spaceId } },
			})
		);

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Space Item deleted successfully',
			}),
		};
	}

	return {
		statusCode: 404,
		body: JSON.stringify({
			message: 'Missing required query parameter',
		}),
	};
}
