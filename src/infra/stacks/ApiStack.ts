import { Stack, StackProps } from 'aws-cdk-lib';
import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
	spacesLambdaIntegration: LambdaIntegration;
	userPool: IUserPool;
}

export class ApiStack extends Stack {
	constructor(scope: Construct, id: string, props: ApiStackProps) {
		super(scope, id, props);

		const api = new RestApi(this, 'SpaceApi');

		// Create a Cognito User Pools authorizer for the API
		// This authorizer will use the user pool created in the AuthStack

		const authorizer = new CognitoUserPoolsAuthorizer(this, 'SpaceApiAuthorizer', {
			cognitoUserPools: [props.userPool],
			identitySource: 'method.request.header.Authorization',
		});

		authorizer._attachToApi(api);
		const optionsWithAuth: MethodOptions = {
			authorizationType: AuthorizationType.COGNITO,
			authorizer: {
				authorizerId: authorizer.authorizerId,
			},
		};

		// Create the root resource and add methods and resources for the API

		const spaceRss = api.root.addResource('spaces');
		spaceRss.addMethod('GET', props.spacesLambdaIntegration, optionsWithAuth);
		spaceRss.addMethod('POST', props.spacesLambdaIntegration, optionsWithAuth);
		spaceRss.addMethod('PUT', props.spacesLambdaIntegration, optionsWithAuth);
		spaceRss.addMethod('DELETE', props.spacesLambdaIntegration, optionsWithAuth);
	}
}
