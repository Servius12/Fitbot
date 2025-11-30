<<<<<<< HEAD
-- Полная SQL схема для Supabase
-- Скопируйте и выполните в SQL Editor в панели Supabase

-- ============================================
-- Таблица регистраций пользователей
-- ============================================
CREATE TABLE IF NOT EXISTS user_registration (
  id BIGSERIAL PRIMARY KEY,
  telegram_id TEXT,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT, -- Добавлено для восстановления пароля
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  requested_role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_role TEXT,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Отключение Row Level Security для демо
ALTER TABLE user_registration DISABLE ROW LEVEL SECURITY;

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_user_registration_username ON user_registration(username);
CREATE INDEX IF NOT EXISTS idx_user_registration_email ON user_registration(email);
CREATE INDEX IF NOT EXISTS idx_user_registration_status ON user_registration(status);
CREATE INDEX IF NOT EXISTS idx_user_registration_telegram_id ON user_registration(telegram_id);

-- ============================================
-- Таблица токенов восстановления пароля
-- ============================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES user_registration(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

ALTER TABLE password_reset_tokens DISABLE ROW LEVEL SECURITY;

-- ============================================
-- Функция для автоматического обновления updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_user_registration_updated_at ON user_registration;
CREATE TRIGGER update_user_registration_updated_at 
    BEFORE UPDATE ON user_registration 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Функция для очистки истекших токенов
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM password_reset_tokens 
    WHERE expires_at < NOW() OR used = TRUE;
END;
$$ language 'plpgsql';

-- ============================================
-- Комментарии
-- ============================================
COMMENT ON TABLE user_registration IS 'Таблица регистраций пользователей';
COMMENT ON COLUMN user_registration.email IS 'Email для восстановления пароля';
COMMENT ON TABLE password_reset_tokens IS 'Токены для восстановления пароля';

=======
-- Полная SQL схема для Supabase
-- Скопируйте и выполните в SQL Editor в панели Supabase

-- ============================================
-- Таблица регистраций пользователей
-- ============================================
CREATE TABLE IF NOT EXISTS user_registration (
  id BIGSERIAL PRIMARY KEY,
  telegram_id TEXT,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT, -- Добавлено для восстановления пароля
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  requested_role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_role TEXT,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Отключение Row Level Security для демо
ALTER TABLE user_registration DISABLE ROW LEVEL SECURITY;

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_user_registration_username ON user_registration(username);
CREATE INDEX IF NOT EXISTS idx_user_registration_email ON user_registration(email);
CREATE INDEX IF NOT EXISTS idx_user_registration_status ON user_registration(status);
CREATE INDEX IF NOT EXISTS idx_user_registration_telegram_id ON user_registration(telegram_id);

-- ============================================
-- Таблица токенов восстановления пароля
-- ============================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES user_registration(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

ALTER TABLE password_reset_tokens DISABLE ROW LEVEL SECURITY;

-- ============================================
-- Функция для автоматического обновления updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
DROP TRIGGER IF EXISTS update_user_registration_updated_at ON user_registration;
CREATE TRIGGER update_user_registration_updated_at 
    BEFORE UPDATE ON user_registration 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Функция для очистки истекших токенов
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM password_reset_tokens 
    WHERE expires_at < NOW() OR used = TRUE;
END;
$$ language 'plpgsql';

-- ============================================
-- Комментарии
-- ============================================
COMMENT ON TABLE user_registration IS 'Таблица регистраций пользователей';
COMMENT ON COLUMN user_registration.email IS 'Email для восстановления пароля';
COMMENT ON TABLE password_reset_tokens IS 'Токены для восстановления пароля';

>>>>>>> 7be83a930b4950ac7ae2256d4f2ec34c8c08c5e7
