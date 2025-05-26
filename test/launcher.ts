import { handler } from '../src/services/spaces/handler';

process.env.AWS_REGION = 'ap-south-1';
process.env.SPACES_TABLE_NAME = 'SpaceStack-02ca41ab5897';

handler(
	{
		httpMethod: 'DELETE',
		queryStringParameters: {
			id: '55d0c9ae-5c3b-48b1-bdf4-f94559c2cbcb', // Example space ID
		},
		// body: JSON.stringify({
		// 	location: 'Paris',
		// }),
	} as any,
	{} as any
)
	.then((response) => {
		console.log('Response:', response);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
