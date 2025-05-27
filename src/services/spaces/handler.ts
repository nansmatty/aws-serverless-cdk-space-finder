import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { postSpaces } from './PostSpaces';
import { getSpaces } from './GetSpaces';
import { updateSpaces } from './UpdateSpace';
import { deleteSpace } from './DeleteSpace';
import { JSONParseError, MissingFieldError } from '../shared/DataValidator';
import { addCorsHeader } from '../shared/Utils';

// APIGatewayProxyEvent is the type for the event parameter because if this handler is accessed via API Gateway
// Context is the type for the context parameter because it contains information about the invocation, function, and execution environment

const dynamodbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
	try {
		let response: APIGatewayProxyResult;

		switch (event.httpMethod) {
			case 'GET':
				const getResponse = await getSpaces(event, dynamodbClient);
				response = getResponse;
				break;
			case 'POST':
				const postResponse = await postSpaces(event, dynamodbClient);
				response = postResponse;
				break;
			case 'PUT':
				const updatedResponse = await updateSpaces(event, dynamodbClient);
				response = updatedResponse;
				break;
			case 'DELETE':
				const deleteResponse = await deleteSpace(event, dynamodbClient);
				response = deleteResponse;
				break;
			default:
				break;
		}

		addCorsHeader(response);
		return response;
	} catch (err) {
		if (err instanceof MissingFieldError) {
			return {
				statusCode: 400,
				body: JSON.stringify(err.message),
			};
		}

		if (err instanceof JSONParseError) {
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
