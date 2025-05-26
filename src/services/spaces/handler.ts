import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { postSpaces } from './PostSpaces';
import { getSpaces } from './GetSpaces';
import { updateSpaces } from './UpdateSpace';
import { deleteSpace } from './DeleteSpace';
import { MissingFieldError } from '../shared/DataValidator';

// APIGatewayProxyEvent is the type for the event parameter because if this handler is accessed via API Gateway
// Context is the type for the context parameter because it contains information about the invocation, function, and execution environment

const dynamodbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
	try {
		let message: string;

		switch (event.httpMethod) {
			case 'GET':
				const getResponse = await getSpaces(event, dynamodbClient);
				return getResponse;
			case 'POST':
				const postResponse = await postSpaces(event, dynamodbClient);
				return postResponse;
			case 'PUT':
				const updatedResponse = await updateSpaces(event, dynamodbClient);
				return updatedResponse;
			case 'DELETE':
				const deleteResponse = await deleteSpace(event, dynamodbClient);
				return deleteResponse;
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
		if (err instanceof MissingFieldError) {
			return {
				statusCode: 400,
				body: JSON.stringify(err.message),
			};
		}

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
