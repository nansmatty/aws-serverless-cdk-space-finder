import { App } from 'aws-cdk-lib';
import { DataStack } from './stacks/Datastack';
import { LambdaStack } from './stacks/LambdaStack';
import { ApiStack } from './stacks/ApiStack';
import { AuthStack } from './stacks/AuthStack';

const app = new App();
const dataStack = new DataStack(app, 'DataStack');
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
	spacesTableName: dataStack.spacesTable,
});

const authStack = new AuthStack(app, 'AuthStack');

// Create the API stack, passing the Lambda integration and user pool from the other stacks for security and functionality

new ApiStack(app, 'ApiStack', {
	spacesLambdaIntegration: lambdaStack.spacesLambdaIntegration,
	userPool: authStack.userPool,
});
