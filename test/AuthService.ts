import { fetchAuthSession, signIn, SignInOutput } from '@aws-amplify/auth';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { Amplify } from 'aws-amplify';

const awsRegion = 'ap-south-1';

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: 'ap-south-1_eZRW1RSuX',
			userPoolClientId: 'ck0qbkquu656ocangb1eut4vp',
			identityPoolId: 'ap-south-1:29bf36f7-b12b-44e3-b691-9ac960765e8b',
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

	public async generateTemporaryCredentials() {
		const idToken = await this.getIdToken();
		const cognitoIdentityPoolId = `cognito-idp.${awsRegion}.amazonaws.com/ap-south-1_eZRW1RSuX`;
		const cognitoIdentity = new CognitoIdentityClient({
			credentials: fromCognitoIdentityPool({
				identityPoolId: 'ap-south-1:29bf36f7-b12b-44e3-b691-9ac960765e8b',
				logins: {
					[cognitoIdentityPoolId]: idToken,
				},
			}),
		});

		const credentials = await cognitoIdentity.config.credentials();
		return credentials;
	}
}
