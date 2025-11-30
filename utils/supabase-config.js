<<<<<<< HEAD
/**
 * Конфигурация Supabase
 * Замените эти значения на ваши из панели Supabase
 */

// Конфигурация Supabase
const SUPABASE_URL = 'https://hmxqqewurxkptxflqjca.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteHFxZXd1cnhrcHR4ZmxxamNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzI1NjAsImV4cCI6MjA4MDA0ODU2MH0.n3SC-1z1tWfhsg9Lt98ZAm3wQccoTCGR08Cx1RXTElk';

// Инициализация Supabase клиента
let supabaseClient = null;

function initSupabase() {
  if (typeof window !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    // Проверяем доступность Supabase
    if (typeof supabase !== 'undefined') {
      // Используем глобальный supabase из CDN
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ Supabase инициализирован');
      return true;
    } else if (window.supabase) {
      // Альтернативный способ
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ Supabase инициализирован');
      return true;
    } else {
      console.warn('⚠️ Supabase JS клиент не загружен. Добавьте скрипт в HTML.');
      return false;
    }
  }
  return false;
}

// Проверка доступности Supabase
function isSupabaseAvailable() {
  return supabaseClient !== null && SUPABASE_URL !== 'YOUR_SUPABASE_URL';
}

// Экспорт
if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
    init: initSupabase,
    isAvailable: isSupabaseAvailable,
    getClient: () => supabaseClient
  };
}

=======
/**
 * Конфигурация Supabase
 * Замените эти значения на ваши из панели Supabase
 */

// Конфигурация Supabase
const SUPABASE_URL = 'https://hmxqqewurxkptxflqjca.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhteHFxZXd1cnhrcHR4ZmxxamNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NzI1NjAsImV4cCI6MjA4MDA0ODU2MH0.n3SC-1z1tWfhsg9Lt98ZAm3wQccoTCGR08Cx1RXTElk';

// Инициализация Supabase клиента
let supabaseClient = null;

function initSupabase() {
  if (typeof window !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    // Проверяем доступность Supabase
    if (typeof supabase !== 'undefined') {
      // Используем глобальный supabase из CDN
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ Supabase инициализирован');
      return true;
    } else if (window.supabase) {
      // Альтернативный способ
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ Supabase инициализирован');
      return true;
    } else {
      console.warn('⚠️ Supabase JS клиент не загружен. Добавьте скрипт в HTML.');
      return false;
    }
  }
  return false;
}

// Проверка доступности Supabase
function isSupabaseAvailable() {
  return supabaseClient !== null && SUPABASE_URL !== 'YOUR_SUPABASE_URL';
}

// Экспорт
if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
    init: initSupabase,
    isAvailable: isSupabaseAvailable,
    getClient: () => supabaseClient
  };
}

>>>>>>> 7be83a930b4950ac7ae2256d4f2ec34c8c08c5e7
