const fs = require('fs');
const path = require('path');

module.exports.handler = async (event, context) => {
  const filePath = path.join(__dirname, 'swagger-ui.html');
  const swaggerUiContent = fs.readFileSync(filePath, 'utf8');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: swaggerUiContent,
  };
};
