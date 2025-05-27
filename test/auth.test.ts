import { AuthService } from './AuthService';

async function testAuthService() {
	const service = new AuthService();

	const loginResponse = await service.login('nansmatty', 'Nans@0312');

	const idToken = await service.getIdToken();
	// console.log('Login Response:', loginResponse);
}

testAuthService();
