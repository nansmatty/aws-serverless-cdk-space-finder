import { v4 } from 'uuid';
import { handler } from '../src/services/spaces/handler';

handler(
	{
		httpMethod: 'POST',
		body: JSON.stringify({
			location: 'Germany Europe',
		}),
	} as any,
	{} as any
);
