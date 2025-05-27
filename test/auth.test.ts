import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { AuthService } from './AuthService';

async function testAuthService() {
	const service = new AuthService();

	const loginResult = await service.login('nansmatty', 'Nans@0312');

	const idToken = await service.getIdToken();
	// console.log('ID Token:', idToken);

	const credentials = await service.generateTemporaryCredentials();

	const buckets = await listBuckets(credentials);
	console.log(...buckets);
}

async function listBuckets(credentials: any) {
	try {
		const s3Client = new S3Client({ credentials });
		const buckets = await s3Client.send(new ListBucketsCommand({}));
		return buckets.Buckets;
	} catch (error) {
		console.log({ error });
	}
}

testAuthService();
