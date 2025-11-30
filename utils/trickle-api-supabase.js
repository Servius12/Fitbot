<<<<<<< HEAD
/**
 * Trickle API с поддержкой Supabase
 * Автоматически использует Supabase, если доступен, иначе localStorage
 */

// Импорт конфигурации Supabase
let supabaseClient = null;
let useSupabase = false;

// Проверка и инициализация Supabase
function checkSupabase() {
  if (typeof window !== 'undefined' && window.SUPABASE_CONFIG) {
    // Пробуем инициализировать
    const initialized = window.SUPABASE_CONFIG.init();
    if (initialized) {
      supabaseClient = window.SUPABASE_CONFIG.getClient();
      useSupabase = supabaseClient !== null;
      if (useSupabase) {
        console.log('✅ Используется Supabase для хранения данных');
      }
    } else {
      // Проверяем, может быть supabase уже загружен глобально
      if (typeof supabase !== 'undefined' && window.SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL') {
        try {
          supabaseClient = supabase.createClient(
            window.SUPABASE_CONFIG.url,
            window.SUPABASE_CONFIG.anonKey
          );
          useSupabase = true;
          console.log('✅ Используется Supabase для хранения данных');
        } catch (error) {
          console.warn('⚠️ Ошибка инициализации Supabase:', error);
        }
      }
    }
  }
  return useSupabase;
}

// Инициализация при загрузке
if (typeof window !== 'undefined') {
  // Проверяем Supabase после загрузки страницы
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkSupabase, 100);
  });
  // Также проверяем сразу
  checkSupabase();
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

// ========== Supabase функции ==========

// Создание объекта в Supabase
async function createObjectSupabase(tableName, objectData) {
  if (!supabaseClient) {
    throw new Error('Supabase не инициализирован');
  }

  const { data, error } = await supabaseClient
    .from(tableName)
    .insert([objectData])
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return {
    objectId: data.id || data.objectId || generateId(),
    objectData: data,
    createdAt: data.created_at || new Date().toISOString()
  };
}

// Получение списка объектов из Supabase
async function listObjectsSupabase(tableName, limit = 100, includeDeleted = false) {
  if (!supabaseClient) {
    throw new Error('Supabase не инициализирован');
  }

  let query = supabaseClient
    .from(tableName)
    .select('*')
    .limit(limit)
    .order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  // Преобразуем формат для совместимости (snake_case -> camelCase)
  const items = (data || []).map(item => {
    // Преобразуем snake_case в camelCase для совместимости
    const objectData = {
      ...item,
      TelegramId: item.telegram_id || item.TelegramId,
      Username: item.username || item.Username,
      Password: item.password || item.Password,
      Email: item.email || item.Email,
      FirstName: item.first_name || item.FirstName,
      LastName: item.last_name || item.LastName,
      RequestedRole: item.requested_role || item.RequestedRole,
      Status: item.status || item.Status,
      ApprovedRole: item.approved_role || item.ApprovedRole,
      RegistrationDate: item.registration_date || item.RegistrationDate
    };
    
    return {
      objectId: item.id || item.objectId || generateId(),
      objectData: objectData,
      createdAt: item.created_at || item.createdAt || new Date().toISOString()
    };
  });

  return {
    items: items,
    total: items.length
  };
}

// Обновление объекта в Supabase
async function updateObjectSupabase(tableName, objectId, objectData) {
  if (!supabaseClient) {
    throw new Error('Supabase не инициализирован');
  }

  // Преобразуем camelCase в snake_case для Supabase
  const updateData = {};
  if (objectData.Status !== undefined) updateData.status = objectData.Status;
  if (objectData.ApprovedRole !== undefined) updateData.approved_role = objectData.ApprovedRole;
  if (objectData.Username !== undefined) updateData.username = objectData.Username;
  if (objectData.Password !== undefined) updateData.password = objectData.Password;
  if (objectData.Email !== undefined) updateData.email = objectData.Email;
  if (objectData.FirstName !== undefined) updateData.first_name = objectData.FirstName;
  if (objectData.LastName !== undefined) updateData.last_name = objectData.LastName;
  if (objectData.RequestedRole !== undefined) updateData.requested_role = objectData.RequestedRole;
  if (objectData.TelegramId !== undefined) updateData.telegram_id = objectData.TelegramId;
  
  // Если данные уже в snake_case, используем их напрямую
  if (objectData.status !== undefined) updateData.status = objectData.status;
  if (objectData.approved_role !== undefined) updateData.approved_role = objectData.approved_role;
  if (objectData.username !== undefined) updateData.username = objectData.username;
  if (objectData.password !== undefined) updateData.password = objectData.password;
  if (objectData.email !== undefined) updateData.email = objectData.email;
  if (objectData.first_name !== undefined) updateData.first_name = objectData.first_name;
  if (objectData.last_name !== undefined) updateData.last_name = objectData.last_name;
  if (objectData.requested_role !== undefined) updateData.requested_role = objectData.requested_role;
  if (objectData.telegram_id !== undefined) updateData.telegram_id = objectData.telegram_id;

  const { data, error } = await supabaseClient
    .from(tableName)
    .update(updateData)
    .eq('id', objectId)
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    console.error('Update data:', updateData);
    throw error;
  }

  // Преобразуем обратно для совместимости
  const objectDataConverted = {
    ...data,
    TelegramId: data.telegram_id || data.TelegramId,
    Username: data.username || data.Username,
    Password: data.password || data.Password,
    Email: data.email || data.Email,
    FirstName: data.first_name || data.FirstName,
    LastName: data.last_name || data.LastName,
    RequestedRole: data.requested_role || data.RequestedRole,
    Status: data.status || data.Status,
    ApprovedRole: data.approved_role || data.ApprovedRole,
    RegistrationDate: data.registration_date || data.RegistrationDate
  };

  return {
    objectId: data.id || objectId,
    objectData: objectDataConverted,
    updatedAt: data.updated_at || new Date().toISOString()
  };
}

// ========== LocalStorage функции ==========

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

// ========== Основные функции (с автоматическим выбором) ==========

// Создание объекта
async function createObject(tableName, objectData) {
  // Проверяем Supabase
  if (checkSupabase() && useSupabase) {
    try {
      console.log('📤 Отправка данных в Supabase:', { tableName, objectData });
      const result = await createObjectSupabase(tableName, objectData);
      console.log('✅ Данные сохранены в Supabase:', result);
      return result;
    } catch (error) {
      console.error('❌ Ошибка Supabase:', error);
      console.warn('⚠️ Ошибка Supabase, используем localStorage:', error.message);
      useSupabase = false; // Отключаем Supabase при ошибке
      // Продолжаем с localStorage
    }
  }
  
  // Fallback на localStorage
  console.log('📤 Отправка данных в localStorage:', { tableName, objectData });
  const result = await createObjectLocalStorage(tableName, objectData);
  console.log('✅ Данные сохранены в localStorage:', result);
  return result;
}

// Получение списка объектов
async function listObjects(tableName, limit = 100, includeDeleted = false) {
  // Проверяем Supabase
  if (checkSupabase() && useSupabase) {
    try {
      return await listObjectsSupabase(tableName, limit, includeDeleted);
    } catch (error) {
      console.warn('⚠️ Ошибка Supabase, используем localStorage:', error);
      useSupabase = false; // Отключаем Supabase при ошибке
    }
  }
  
  // Fallback на localStorage
  return await listObjectsLocalStorage(tableName, limit, includeDeleted);
}

// Обновление объекта
async function updateObject(tableName, objectId, objectData) {
  // Проверяем Supabase
  if (checkSupabase() && useSupabase) {
    try {
      return await updateObjectSupabase(tableName, objectId, objectData);
    } catch (error) {
      console.warn('⚠️ Ошибка Supabase, используем localStorage:', error);
      useSupabase = false; // Отключаем Supabase при ошибке
    }
  }
  
  // Fallback на localStorage
  return await updateObjectLocalStorage(tableName, objectId, objectData);
}

// Удаление объекта
async function deleteObject(tableName, objectId) {
  if (checkSupabase() && useSupabase && supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from(tableName)
        .delete()
        .eq('id', objectId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.warn('⚠️ Ошибка Supabase:', error);
    }
  }
  
  // Fallback на localStorage
  const objects = getStoredObjects(tableName);
  const filtered = objects.filter(obj => obj.objectId !== objectId);
  saveStoredObjects(tableName, filtered);
  return { success: true };
}

// Экспорт функций (синхронно, чтобы были доступны сразу)
if (typeof window !== 'undefined') {
  // Устанавливаем функции сразу
  window.trickleCreateObject = createObject;
  window.trickleListObjects = listObjects;
  window.trickleUpdateObject = updateObject;
  window.trickleDeleteObject = deleteObject;
  
  // Также устанавливаем глобально для совместимости
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
  setTimeout(() => {
    if (useSupabase) {
      console.log('✅ Trickle API: Supabase Mode (данные на сервере)');
    } else {
      console.log('✅ Trickle API: LocalStorage Mode (данные локально)');
    }
    console.log('✅ API функции доступны:', {
      create: typeof window.trickleCreateObject !== 'undefined',
      list: typeof window.trickleListObjects !== 'undefined',
      update: typeof window.trickleUpdateObject !== 'undefined',
      delete: typeof window.trickleDeleteObject !== 'undefined'
    });
  }, 500);
}

=======
/**
 * Trickle API с поддержкой Supabase
 * Автоматически использует Supabase, если доступен, иначе localStorage
 */

// Импорт конфигурации Supabase
let supabaseClient = null;
let useSupabase = false;

// Проверка и инициализация Supabase
function checkSupabase() {
  if (typeof window !== 'undefined' && window.SUPABASE_CONFIG) {
    // Пробуем инициализировать
    const initialized = window.SUPABASE_CONFIG.init();
    if (initialized) {
      supabaseClient = window.SUPABASE_CONFIG.getClient();
      useSupabase = supabaseClient !== null;
      if (useSupabase) {
        console.log('✅ Используется Supabase для хранения данных');
      }
    } else {
      // Проверяем, может быть supabase уже загружен глобально
      if (typeof supabase !== 'undefined' && window.SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL') {
        try {
          supabaseClient = supabase.createClient(
            window.SUPABASE_CONFIG.url,
            window.SUPABASE_CONFIG.anonKey
          );
          useSupabase = true;
          console.log('✅ Используется Supabase для хранения данных');
        } catch (error) {
          console.warn('⚠️ Ошибка инициализации Supabase:', error);
        }
      }
    }
  }
  return useSupabase;
}

// Инициализация при загрузке
if (typeof window !== 'undefined') {
  // Проверяем Supabase после загрузки страницы
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkSupabase, 100);
  });
  // Также проверяем сразу
  checkSupabase();
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

// ========== Supabase функции ==========

// Создание объекта в Supabase
async function createObjectSupabase(tableName, objectData) {
  if (!supabaseClient) {
    throw new Error('Supabase не инициализирован');
  }

  const { data, error } = await supabaseClient
    .from(tableName)
    .insert([objectData])
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return {
    objectId: data.id || data.objectId || generateId(),
    objectData: data,
    createdAt: data.created_at || new Date().toISOString()
  };
}

// Получение списка объектов из Supabase
async function listObjectsSupabase(tableName, limit = 100, includeDeleted = false) {
  if (!supabaseClient) {
    throw new Error('Supabase не инициализирован');
  }

  let query = supabaseClient
    .from(tableName)
    .select('*')
    .limit(limit)
    .order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  // Преобразуем формат для совместимости (snake_case -> camelCase)
  const items = (data || []).map(item => {
    // Преобразуем snake_case в camelCase для совместимости
    const objectData = {
      ...item,
      TelegramId: item.telegram_id || item.TelegramId,
      Username: item.username || item.Username,
      Password: item.password || item.Password,
      Email: item.email || item.Email,
      FirstName: item.first_name || item.FirstName,
      LastName: item.last_name || item.LastName,
      RequestedRole: item.requested_role || item.RequestedRole,
      Status: item.status || item.Status,
      ApprovedRole: item.approved_role || item.ApprovedRole,
      RegistrationDate: item.registration_date || item.RegistrationDate
    };
    
    return {
      objectId: item.id || item.objectId || generateId(),
      objectData: objectData,
      createdAt: item.created_at || item.createdAt || new Date().toISOString()
    };
  });

  return {
    items: items,
    total: items.length
  };
}

// Обновление объекта в Supabase
async function updateObjectSupabase(tableName, objectId, objectData) {
  if (!supabaseClient) {
    throw new Error('Supabase не инициализирован');
  }

  const { data, error } = await supabaseClient
    .from(tableName)
    .update(objectData)
    .eq('id', objectId)
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return {
    objectId: data.id || objectId,
    objectData: data,
    updatedAt: data.updated_at || new Date().toISOString()
  };
}

// ========== LocalStorage функции ==========

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

// ========== Основные функции (с автоматическим выбором) ==========

// Создание объекта
async function createObject(tableName, objectData) {
  // Проверяем Supabase
  if (checkSupabase() && useSupabase) {
    try {
      return await createObjectSupabase(tableName, objectData);
    } catch (error) {
      console.warn('⚠️ Ошибка Supabase, используем localStorage:', error);
      useSupabase = false; // Отключаем Supabase при ошибке
    }
  }
  
  // Fallback на localStorage
  return await createObjectLocalStorage(tableName, objectData);
}

// Получение списка объектов
async function listObjects(tableName, limit = 100, includeDeleted = false) {
  // Проверяем Supabase
  if (checkSupabase() && useSupabase) {
    try {
      return await listObjectsSupabase(tableName, limit, includeDeleted);
    } catch (error) {
      console.warn('⚠️ Ошибка Supabase, используем localStorage:', error);
      useSupabase = false; // Отключаем Supabase при ошибке
    }
  }
  
  // Fallback на localStorage
  return await listObjectsLocalStorage(tableName, limit, includeDeleted);
}

// Обновление объекта
async function updateObject(tableName, objectId, objectData) {
  // Проверяем Supabase
  if (checkSupabase() && useSupabase) {
    try {
      return await updateObjectSupabase(tableName, objectId, objectData);
    } catch (error) {
      console.warn('⚠️ Ошибка Supabase, используем localStorage:', error);
      useSupabase = false; // Отключаем Supabase при ошибке
    }
  }
  
  // Fallback на localStorage
  return await updateObjectLocalStorage(tableName, objectId, objectData);
}

// Удаление объекта
async function deleteObject(tableName, objectId) {
  if (checkSupabase() && useSupabase && supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from(tableName)
        .delete()
        .eq('id', objectId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.warn('⚠️ Ошибка Supabase:', error);
    }
  }
  
  // Fallback на localStorage
  const objects = getStoredObjects(tableName);
  const filtered = objects.filter(obj => obj.objectId !== objectId);
  saveStoredObjects(tableName, filtered);
  return { success: true };
}

// Экспорт функций
if (typeof window !== 'undefined') {
  window.trickleCreateObject = createObject;
  window.trickleListObjects = listObjects;
  window.trickleUpdateObject = updateObject;
  window.trickleDeleteObject = deleteObject;
  
  // Логирование режима работы
  setTimeout(() => {
    if (useSupabase) {
      console.log('✅ Trickle API: Supabase Mode (данные на сервере)');
    } else {
      console.log('✅ Trickle API: LocalStorage Mode (данные локально)');
    }
  }, 500);
}

>>>>>>> 7be83a930b4950ac7ae2256d4f2ec34c8c08c5e7
