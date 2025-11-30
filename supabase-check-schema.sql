-- Скрипт для проверки структуры базы данных
-- Выполните этот скрипт, чтобы убедиться, что все создано правильно

-- ============================================
-- Проверка таблицы user_registration
-- ============================================
SELECT 
    'user_registration' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_registration'
ORDER BY ordinal_position;

-- ============================================
-- Проверка таблицы password_reset_tokens
-- ============================================
SELECT 
    'password_reset_tokens' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'password_reset_tokens'
ORDER BY ordinal_position;

-- ============================================
-- Проверка индексов
-- ============================================
SELECT 
    tablename,
    indexname
FROM pg_indexes
WHERE tablename IN ('user_registration', 'password_reset_tokens')
ORDER BY tablename, indexname;

-- ============================================
-- Проверка функций
-- ============================================
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('update_updated_at_column', 'cleanup_expired_tokens');

