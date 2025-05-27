import { fetchAuthSession, signIn, SignInOutput } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';

const awsRegion = 'ap-south-1';

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: 'ap-south-1_eZRW1RSuX',
			userPoolClientId: 'ck0qbkquu656ocangb1eut4vp',
		},
	},
});

export class AuthService {
	public async login(username: string, password: string) {
		const signInOutput: SignInOutput = await signIn({
			username,
			password,
			options: {
				authFlowType: 'USER_PASSWORD_AUTH',
			},
		});

		return signInOutput;
	}

	/**
	 * Call only after login
	 **/

	public async getIdToken() {
		const authSession = await fetchAuthSession();
		return authSession.tokens?.idToken?.toString();
	}
}
