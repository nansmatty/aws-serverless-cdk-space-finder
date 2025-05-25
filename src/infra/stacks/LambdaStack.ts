import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

interface LambdaStackProps extends StackProps {
	spacesTableName: ITable;
}

export class LambdaStack extends Stack {
	public readonly spacesLambdaIntegration: LambdaIntegration;

	constructor(scope: Construct, id: string, props: LambdaStackProps) {
		super(scope, id, props);

		const spacesLambda = new NodejsFunction(this, 'HelloLambdaFn', {
			runtime: Runtime.NODEJS_20_X,
			handler: 'handler',
			entry: join(__dirname, '..', '..', 'services', 'spaces', 'handler.ts'),
			environment: {
				SPACES_TABLE_NAME: props.spacesTableName.tableName,
			},
		});

		// Granting the Lambda function permissions to access the DynamoDB table

		spacesLambda.addToRolePolicy(
			new PolicyStatement({
				effect: Effect.ALLOW,
				resources: [props.spacesTableName.tableArn],
				actions: ['dynamodb:PutItem', 'dynamodb:Scan', 'dynamodb:GetItem'],
			})
		);

		this.spacesLambdaIntegration = new LambdaIntegration(spacesLambda);
	}
}
