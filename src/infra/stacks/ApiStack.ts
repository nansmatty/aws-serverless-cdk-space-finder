import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
	spacesLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
	constructor(scope: Construct, id: string, props: ApiStackProps) {
		super(scope, id, props);

		const api = new RestApi(this, 'SpaceApi');
		const spaceRss = api.root.addResource('spaces');
		spaceRss.addMethod('GET', props.spacesLambdaIntegration);
		spaceRss.addMethod('POST', props.spacesLambdaIntegration);
		spaceRss.addMethod('PUT', props.spacesLambdaIntegration);
		spaceRss.addMethod('DELETE', props.spacesLambdaIntegration);
	}
}
