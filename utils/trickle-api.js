/**
 * Trickle API обертка
 * Если Trickle SDK доступен - использует его, иначе использует localStorage для демо
 */

// Хранилище в localStorage для демо-режима
const STORAGE_PREFIX = 'trickle_demo_';

function getStorageKey(tableName) {
  return `${STORAGE_PREFIX}${tableName}`;
}

// Инициализация хранилища
function initStorage(tableName) {
  const key = getStorageKey(tableName);
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify([]));
  }
}

// Получить все объекты из хранилища
function getStoredObjects(tableName) {
  initStorage(tableName);
  const key = getStorageKey(tableName);
  const data = localStorage.getItem(key);
  return JSON.parse(data || '[]');
}

// Сохранить объекты в хранилище
function saveStoredObjects(tableName, objects) {
  const key = getStorageKey(tableName);
  localStorage.setItem(key, JSON.stringify(objects));
}

// Генерация ID
function generateId() {
  return 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Создание объекта
async function createObject(tableName, objectData) {
  // Всегда используем localStorage для демо
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

// Получение списка объектов
async function listObjects(tableName, limit = 100, includeDeleted = false) {
  // Всегда используем localStorage для демо
  const objects = getStoredObjects(tableName);
  const items = objects.slice(0, limit);
  return {
    items: items,
    total: objects.length
  };
}

// Обновление объекта
async function updateObject(tableName, objectId, objectData) {
  // Всегда используем localStorage для демо
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

// Удаление объекта
async function deleteObject(tableName, objectId) {
  // Всегда используем localStorage для демо
  const objects = getStoredObjects(tableName);
  const filtered = objects.filter(obj => obj.objectId !== objectId);
  saveStoredObjects(tableName, filtered);
  return { success: true };
}

// Экспорт функций (глобальные функции для совместимости)
if (typeof window !== 'undefined') {
  // Устанавливаем функции глобально
  window.trickleCreateObject = createObject;
  window.trickleListObjects = listObjects;
  window.trickleUpdateObject = updateObject;
  window.trickleDeleteObject = deleteObject;
  
  // Также устанавливаем без префикса window для совместимости
  if (typeof trickleCreateObject === 'undefined') {
    window.trickleCreateObject = createObject;
  }
  if (typeof trickleListObjects === 'undefined') {
    window.trickleListObjects = listObjects;
  }
  if (typeof trickleUpdateObject === 'undefined') {
    window.trickleUpdateObject = updateObject;
  }
  if (typeof trickleDeleteObject === 'undefined') {
    window.trickleDeleteObject = deleteObject;
  }
  
  // Логирование режима работы
  console.log('✅ Trickle API: LocalStorage Demo Mode (работает без сервера)');
  console.log('📦 Данные сохраняются в localStorage браузера');
  console.log('🔑 Ключ хранилища:', STORAGE_PREFIX + 'user_registration');
  
  // Проверка доступности localStorage
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log('✅ localStorage доступен');
  } catch (e) {
    console.error('❌ localStorage недоступен:', e);
  }
}
