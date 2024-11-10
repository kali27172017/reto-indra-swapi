const fs = require('fs');
const path = require('path');

module.exports.handler = async (event, context) => {
  const filePath = path.join(__dirname, 'openapi.json');
  const openApiContent = fs.readFileSync(filePath, 'utf8');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: openApiContent,
  };
};
