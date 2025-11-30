// Netlify Function для сохранения заявки
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
      const registrationData = JSON.parse(event.body);
      
      // Генерируем ID
      const objectId = 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const newRegistration = {
        objectId: objectId,
        objectData: registrationData,
        createdAt: new Date().toISOString()
      };

      // Сохраняем в файл (в реальном проекте - в базу данных)
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

      registrations.push(newRegistration);
      fs.writeFileSync(dataFile, JSON.stringify(registrations, null, 2));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          objectId: objectId,
          objectData: newRegistration
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

