-- Исправленная SQL схема для Supabase
-- Используйте этот скрипт, если таблица user_registration уже существует

-- ============================================
-- Обновление таблицы user_registration
-- ============================================

-- Добавление колонки email, если её нет
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_registration' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE user_registration ADD COLUMN email TEXT;
    END IF;
END $$;

-- Создание индекса для email
CREATE INDEX IF NOT EXISTS idx_user_registration_email ON user_registration(email);

-- ============================================
-- Создание таблицы password_reset_tokens
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

-- Индексы
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Отключение RLS
ALTER TABLE password_reset_tokens DISABLE ROW LEVEL SECURITY;

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

-- Комментарии
COMMENT ON COLUMN user_registration.email IS 'Email для восстановления пароля';
COMMENT ON TABLE password_reset_tokens IS 'Токены для восстановления пароля';

