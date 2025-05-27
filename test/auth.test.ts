import { AuthService } from './AuthService';

async function testAuthService() {
	const service = new AuthService();

	await service.login('nansmatty', 'Nans@0312');

	const idToken = await service.getIdToken();
	// console.log('ID Token:', idToken);

	const credentials = await service.generateTemporaryCredentials();
	const a = 5;
}

testAuthService();
// .then(() => {
// 	console.log('Authentication test completed successfully.');
// })
// .catch((error) => {
// 	console.error('Error during authentication test:', error);
// });
