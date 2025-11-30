/**
 * Trickle API с использованием внешнего хранилища
 * Использует простой JSON файл через GitHub или localStorage с синхронизацией
 */

const API_BASE_URL = window.location.origin;

// Проверка доступности серверных функций
async function checkServerAvailable() {
  try {
    const response = await fetch(`${API_BASE_URL}/.netlify/functions/get-registrations`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Создание объекта (сначала пробуем сервер, потом localStorage)
async function createObject(tableName, objectData) {
  // Для user_registration используем сервер, если доступен
  if (tableName === 'user_registration') {
    const serverAvailable = await checkServerAvailable();
    
    if (serverAvailable) {
      try {
        const response = await fetch(`${API_BASE_URL}/.netlify/functions/save-registration`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(objectData)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Данные сохранены на сервере');
          return result.objectData || result;
        }
      } catch (error) {
        console.warn('⚠️ Сервер недоступен, используем localStorage:', error);
      }
    }
  }
  
  // Fallback на localStorage
  return createObjectLocalStorage(tableName, objectData);
}

// Получение списка объектов
async function listObjects(tableName, limit = 100, includeDeleted = false) {
  // Для user_registration используем сервер, если доступен
  if (tableName === 'user_registration') {
    const serverAvailable = await checkServerAvailable();
    
    if (serverAvailable) {
      try {
        const response = await fetch(`${API_BASE_URL}/.netlify/functions/get-registrations`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Данные загружены с сервера');
          return {
            items: result.items || [],
            total: result.total || 0
          };
        }
      } catch (error) {
        console.warn('⚠️ Сервер недоступен, используем localStorage:', error);
      }
    }
  }
  
  // Fallback на localStorage
  return listObjectsLocalStorage(tableName, limit, includeDeleted);
}

// Обновление объекта
async function updateObject(tableName, objectId, objectData) {
  // Для user_registration используем сервер, если доступен
  if (tableName === 'user_registration') {
    const serverAvailable = await checkServerAvailable();
    
    if (serverAvailable) {
      try {
        const response = await fetch(`${API_BASE_URL}/.netlify/functions/update-registration`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ objectId, updates: objectData })
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Данные обновлены на сервере');
          return result.object || result;
        }
      } catch (error) {
        console.warn('⚠️ Сервер недоступен, используем localStorage:', error);
      }
    }
  }
  
  // Fallback на localStorage
  return updateObjectLocalStorage(tableName, objectId, objectData);
}

// ========== LocalStorage функции (fallback) ==========

const STORAGE_PREFIX = 'trickle_demo_';

function getStorageKey(tableName) {
  return `${STORAGE_PREFIX}${tableName}`;
}

function initStorage(tableName) {
  const key = getStorageKey(tableName);
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify([]));
  }
}

function getStoredObjects(tableName) {
  initStorage(tableName);
  const key = getStorageKey(tableName);
  const data = localStorage.getItem(key);
  return JSON.parse(data || '[]');
}

function saveStoredObjects(tableName, objects) {
  const key = getStorageKey(tableName);
  localStorage.setItem(key, JSON.stringify(objects));
}

function generateId() {
  return 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function createObjectLocalStorage(tableName, objectData) {
  const objects = getStoredObjects(tableName);
  const newObject = {
    objectId: generateId(),
    objectData: objectData,
    createdAt: new Date().toISOString()
  };
  objects.push(newObject);
  saveStoredObjects(tableName, objects);
  return newObject;
}

async function listObjectsLocalStorage(tableName, limit = 100, includeDeleted = false) {
  const objects = getStoredObjects(tableName);
  const items = objects.slice(0, limit);
  return {
    items: items,
    total: objects.length
  };
}

async function updateObjectLocalStorage(tableName, objectId, objectData) {
  const objects = getStoredObjects(tableName);
  const index = objects.findIndex(obj => obj.objectId === objectId);
  if (index !== -1) {
    objects[index].objectData = { ...objects[index].objectData, ...objectData };
    objects[index].updatedAt = new Date().toISOString();
    saveStoredObjects(tableName, objects);
    return objects[index];
  } else {
    throw new Error('Object not found');
  }
}

// Экспорт функций
if (typeof window !== 'undefined') {
  window.trickleCreateObject = createObject;
  window.trickleListObjects = listObjects;
  window.trickleUpdateObject = updateObject;
  
  console.log('✅ Trickle API: Server + LocalStorage Mode');
  console.log('📦 Данные сохраняются на сервере (если доступен) или в localStorage');
}

