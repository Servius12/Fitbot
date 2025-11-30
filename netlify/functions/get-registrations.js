// Netlify Function для получения заявок
exports.handler = async (event, context) => {
  // Разрешаем CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Обработка OPTIONS запроса
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod === 'GET') {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const dataFile = path.join('/tmp', 'registrations.json');
      let registrations = [];
      
      try {
        if (fs.existsSync(dataFile)) {
          const data = fs.readFileSync(dataFile, 'utf8');
          registrations = JSON.parse(data);
        }
      } catch (err) {
        console.error('Error reading file:', err);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          items: registrations,
          total: registrations.length
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: error.message
        }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
