import { SNSEvent } from 'aws-lambda';

const slackWebhookUrl = 'it was in new .env file ';

async function handler(event: SNSEvent, context) {
	for (const record of event.Records) {
		await fetch(slackWebhookUrl, {
			method: 'POST',
			body: JSON.stringify({
				text: `Huston, we had a problem: ${record.Sns.Message}`,
			}),
		});
	}
}

export { handler };
