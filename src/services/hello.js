exports.main = async function (event, context) {
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: 'Hello from the serverless function!',
			tableName: `Hello the DynamoDb Table Name is: ${process.env.SPACES_TABLE_NAME}`,
		}),
	};
};
