import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 } from 'uuid';

// APIGatewayProxyEvent is the type for the event parameter because if this handler is accessed via API Gateway
// Context is the type for the context parameter because it contains information about the invocation, function, and execution environment

async function handler(event: APIGatewayProxyEvent, context: Context) {
	const response: APIGatewayProxyResult = {
		statusCode: 200,
		body: JSON.stringify({
			message: 'Hello from the serverless function!',
			randomId: v4(),
			tableName: `Hello the DynamoDb Table Name is: ${process.env.SPACES_TABLE_NAME}`,
		}),
	};

	// Log the event and context to the'
	console.log('Event:', JSON.stringify(event));

	return response;
}

export { handler };
