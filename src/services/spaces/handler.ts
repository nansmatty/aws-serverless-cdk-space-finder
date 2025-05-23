import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

// APIGatewayProxyEvent is the type for the event parameter because if this handler is accessed via API Gateway
// Context is the type for the context parameter because it contains information about the invocation, function, and execution environment

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
	try {
		let message: string;

		switch (event.httpMethod) {
			case 'GET':
				message = 'Hello from the GET serverless function!';
				break;
			case 'POST':
				message = 'Hello from the POST serverless function!';
				break;
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
		console.log('Error', err);
	}
}

export { handler };
