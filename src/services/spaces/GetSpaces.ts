import { DynamoDBClient, GetItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function getSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
	if (event.queryStringParameters) {
		if ('id' in event.queryStringParameters) {
			const spaceId = event.queryStringParameters['id'];
			const response = await ddbClient.send(
				new GetItemCommand({
					TableName: process.env.SPACES_TABLE_NAME || '',
					Key: {
						id: { S: spaceId },
					},
				})
			);

			return {
				statusCode: response.Item ? 200 : 404,
				body: JSON.stringify({
					result: response.Item ? unmarshall(response.Item) : 'Space not found',
				}),
			};
		} else {
			return {
				statusCode: 401,
				body: JSON.stringify({
					message: 'Missing required query parameter: id',
				}),
			};
		}
	}

	const result = await ddbClient.send(
		new ScanCommand({
			TableName: process.env.SPACES_TABLE_NAME || '',
		})
	);

	const unmarshalledItems = result.Items.map((item) => unmarshall(item));

	console.log(unmarshalledItems);

	return {
		statusCode: result.Items ? 200 : 404,
		body: JSON.stringify({
			result: result.Items ? unmarshalledItems : 'No spaces found',
		}),
	};
}
