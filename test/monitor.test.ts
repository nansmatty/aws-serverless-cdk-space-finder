import { SNSEvent } from 'aws-lambda';
import { handler } from '../src/services/monitor/handler';

const SNSEvent: SNSEvent = {
	Records: [
		{
			Sns: {
				Message: 'This is a test.',
			},
		},
	],
} as any;

handler(SNSEvent, {});
