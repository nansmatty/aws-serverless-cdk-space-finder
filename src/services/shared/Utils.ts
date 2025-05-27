import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { JSONParseError } from './DataValidator';
import { randomUUID } from 'crypto';

export function createRandomId() {
	return randomUUID();
}

export function parseJSON(arg: string) {
	try {
		return JSON.parse(arg);
	} catch (error) {
		throw new JSONParseError(error.message);
	}
}

export function hasAdminGroup(event: APIGatewayProxyEvent) {
	const groups = event.requestContext.authorizer?.claims['cognito:groups'];
	if (groups) {
		return (groups as string).includes('SpaceAdmins');
	}
	return false;
}

export function addCorsHeader(arg: APIGatewayProxyResult) {
	if (!arg.headers) {
		arg.headers = {};
	}

	arg.headers['Access-Control-Allow-Origin'] = '*';
	arg.headers['Access-Control-Allow-Methods'] = '*';
}
