import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function as LambdaFn, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { join } from 'path';

interface LambdaStackProps extends StackProps {
	spacesTableName: ITable;
}

export class LambdaStack extends Stack {
	public readonly helloLambdaIntegration: LambdaIntegration;

	constructor(scope: Construct, id: string, props: LambdaStackProps) {
		super(scope, id, props);

		const helloLambda = new LambdaFn(this, 'HelloLambdaFn', {
			runtime: Runtime.NODEJS_20_X,
			handler: 'hello.main',
			code: Code.fromAsset(join(__dirname, '..', '..', 'services')),
			environment: {
				SPACES_TABLE_NAME: props.spacesTableName.tableName,
			},
		});

		this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
	}
}
