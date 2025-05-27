import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';
import { join } from 'path';
import { existsSync } from 'fs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { AccessLevel, Distribution } from 'aws-cdk-lib/aws-cloudfront';

export class UiDeploymentStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const suffix = getSuffixFromStack(this);

		const deploymentBucket = new Bucket(this, 'uiDeploymentBucket', {
			bucketName: `space-finder-frontend-${suffix}`,
		});

		const uiDirectory = join(__dirname, '..', '..', '..', '..', 'space-finder-frontend', 'dist');

		if (!existsSync(uiDirectory)) {
			console.warn('UI Directory not found: ' + uiDirectory);
			return;
		}

		new BucketDeployment(this, 'SpaceFinderDeployment', {
			destinationBucket: deploymentBucket,
			sources: [Source.asset(uiDirectory)],
		});

		const s3Origin = S3BucketOrigin.withOriginAccessControl(deploymentBucket, {
			originAccessLevels: [AccessLevel.READ],
		});

		const distribution = new Distribution(this, 'SpacesFinderDistribution', {
			defaultRootObject: 'index.html',
			defaultBehavior: {
				origin: s3Origin,
			},
		});

		new CfnOutput(this, 'SpaceFinderURL', {
			value: distribution.distributionDomainName,
		});
	}
}
