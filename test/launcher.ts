import { handler } from '../src/services/spaces/handler';

process.env.AWS_REGION = 'ap-south-1';
process.env.SPACES_TABLE_NAME = 'SpaceStack-02ca41ab5897';

handler(
	{
		httpMethod: 'PUT',
		queryStringParameters: {
			id: '444f7c7c-e469-424d-84e9-c25e1dae0429', // Example space ID
		},
		body: JSON.stringify({
			location: 'Kyiv',
		}),
	} as any,
	{} as any
)
	.then((response) => {
		console.log('Response:', response);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
