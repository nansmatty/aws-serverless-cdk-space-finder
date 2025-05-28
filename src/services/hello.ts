import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 } from 'uuid';

const s3Client = new S3Client({});

// APIGatewayProxyEvent is the type for the event parameter because if this handler is accessed via API Gateway
// Context is the type for the context parameter because it contains information about the invocation, function, and execution environment

async function handler(event: APIGatewayProxyEvent, context: Context) {
	// List all S3 buckets
	try {
		const data = await s3Client.send(new ListBucketsCommand({}));
		console.log('Success', data.Buckets);

		const response: APIGatewayProxyResult = {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Hello from the serverless function!',
				randomId: v4(),
				tableName: `Hello the DynamoDb Table Name is: ${process.env.SPACES_TABLE_NAME}`,
				s3BucketsList: [...data.Buckets],
			}),
		};

		// Log the event and context to the'
		console.log('Event:', JSON.stringify(event));

		return response;
	} catch (err) {
		console.log('Error', err);
	}
}

export { handler };

// This is the line needed to update the frontend code in cloudfront
// aws cloudfront create-invalidation --distribution-id E15MUCPPIM7Q5L --paths "/*"
