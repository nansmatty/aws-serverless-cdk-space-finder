import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

interface LambdaStackProps extends StackProps {
	spacesTableName: ITable;
}

export class LambdaStack extends Stack {
	public readonly helloLambdaIntegration: LambdaIntegration;

	constructor(scope: Construct, id: string, props: LambdaStackProps) {
		super(scope, id, props);

		const helloLambda = new NodejsFunction(this, 'HelloLambdaFn', {
			runtime: Runtime.NODEJS_20_X,
			handler: 'handler',
			entry: join(__dirname, '..', '..', 'services', 'hello.ts'),
			environment: {
				SPACES_TABLE_NAME: props.spacesTableName.tableName,
			},
		});

		this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
	}
}
