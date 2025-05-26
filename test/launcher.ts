import { handler } from '../src/services/spaces/handler';

process.env.AWS_REGION = 'ap-south-1';
process.env.SPACES_TABLE_NAME = 'SpaceStack-02ca41ab5897';

handler(
	{
		httpMethod: 'PUT',
		queryStringParameters: {
			id: 'eb8d0f31-07f2-428d-aa58-483c77157642', // Example space ID
		},
		body: JSON.stringify({
			location: 'Paris',
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
