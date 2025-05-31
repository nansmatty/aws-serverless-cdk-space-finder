import { SNSEvent } from 'aws-lambda';

const slackWebhookUrl = 'https://hooks.slack.com/services/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';

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
