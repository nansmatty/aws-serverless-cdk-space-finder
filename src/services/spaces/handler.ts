import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { postSpaces } from './PostSpaces';

// APIGatewayProxyEvent is the type for the event parameter because if this handler is accessed via API Gateway
// Context is the type for the context parameter because it contains information about the invocation, function, and execution environment

const dynamodbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
	try {
		let message: string;

		switch (event.httpMethod) {
			case 'GET':
				message = 'Hello from the GET serverless function!';
				break;
			case 'POST':
				const response = await postSpaces(event, dynamodbClient);
				return response;
			default:
				break;
		}

		const response: APIGatewayProxyResult = {
			statusCode: 200,
			body: JSON.stringify({
				message,
			}),
		};

		return response;
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: 'An error occurred',
				error: (err as Error).message,
			}),
		};
	}
}

export { handler };
