-- SQL скрипт для создания таблицы user_registration в Supabase
-- Скопируйте и выполните в SQL Editor в панели Supabase

-- Создание таблицы
CREATE TABLE IF NOT EXISTS user_registration (
  id BIGSERIAL PRIMARY KEY,
  telegram_id TEXT,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  requested_role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_role TEXT,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Отключение Row Level Security для демо (опционально)
-- Для продакшена лучше настроить политики
ALTER TABLE user_registration DISABLE ROW LEVEL SECURITY;

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_user_registration_username ON user_registration(username);
CREATE INDEX IF NOT EXISTS idx_user_registration_status ON user_registration(status);
CREATE INDEX IF NOT EXISTS idx_user_registration_telegram_id ON user_registration(telegram_id);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_user_registration_updated_at 
    BEFORE UPDATE ON user_registration 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Комментарии к таблице и колонкам
COMMENT ON TABLE user_registration IS 'Таблица регистраций пользователей';
COMMENT ON COLUMN user_registration.id IS 'Уникальный идентификатор';
COMMENT ON COLUMN user_registration.telegram_id IS 'ID пользователя в Telegram';
COMMENT ON COLUMN user_registration.username IS 'Логин пользователя';
COMMENT ON COLUMN user_registration.password IS 'Пароль пользователя';
COMMENT ON COLUMN user_registration.first_name IS 'Имя пользователя';
COMMENT ON COLUMN user_registration.last_name IS 'Фамилия пользователя';
COMMENT ON COLUMN user_registration.requested_role IS 'Запрошенная роль (client/trainer)';
COMMENT ON COLUMN user_registration.status IS 'Статус заявки (pending/approved/rejected)';
COMMENT ON COLUMN user_registration.approved_role IS 'Одобренная роль администратором';
COMMENT ON COLUMN user_registration.registration_date IS 'Дата регистрации';
COMMENT ON COLUMN user_registration.created_at IS 'Дата создания записи';
COMMENT ON COLUMN user_registration.updated_at IS 'Дата последнего обновления';

