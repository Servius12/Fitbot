// Netlify Function для обновления заявки
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

  if (event.httpMethod === 'POST') {
    try {
      const { objectId, updates } = JSON.parse(event.body);
      
      // Читаем данные
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

      // Находим и обновляем
      const index = registrations.findIndex(r => r.objectId === objectId);
      if (index !== -1) {
        registrations[index].objectData = { ...registrations[index].objectData, ...updates };
        registrations[index].updatedAt = new Date().toISOString();
        fs.writeFileSync(dataFile, JSON.stringify(registrations, null, 2));
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            object: registrations[index]
          }),
        };
      } else {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Registration not found'
          }),
        };
      }
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

