#!/usr/bin/env python3
"""
Telegram Bot для Фитнес Тренера
Обрабатывает команды и открывает Web App
Работает на Replit.com
"""

from telegram import Update, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes
import os
import logging

# Keep-alive для Replit (опционально)
try:
    import keep_alive
    KEEP_ALIVE_AVAILABLE = True
except ImportError:
    KEEP_ALIVE_AVAILABLE = False

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Токен бота (из переменной окружения или напрямую)
BOT_TOKEN = os.getenv("BOT_TOKEN", "8478471129:AAGH5iaO6TTLVM8QnSdYCSzwvtQuzlN4qdk")

# URL вашего приложения (из переменной окружения или напрямую)
WEB_APP_URL = os.getenv("WEB_APP_URL", "https://personaltrainerbot.netlify.app")

# ⚠️ ВАЖНО: 
# 1. Для Replit: установите переменные окружения в Secrets (Tools → Secrets)
# 2. Или обновите значения выше напрямую

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /start"""
    await update.message.reply_text(
        "👋 Добро пожаловать в Фитнес Тренер!\n\n"
        "Нажмите кнопку ниже, чтобы открыть приложение:",
        reply_markup={
            "inline_keyboard": [[
                {"text": "🏋️ Открыть приложение", 
                 "web_app": {"url": f"{WEB_APP_URL}/register.html"}}
            ]]
        }
    )

async def register(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /register"""
    await update.message.reply_text(
        "Открываю форму регистрации...",
        reply_markup={
            "inline_keyboard": [[
                {"text": "📝 Зарегистрироваться", 
                 "web_app": {"url": f"{WEB_APP_URL}/register.html"}}
            ]]
        }
    )

async def profile(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /profile"""
    await update.message.reply_text(
        "Открываю ваш профиль...",
        reply_markup={
            "inline_keyboard": [[
                {"text": "👤 Мой профиль", 
                 "web_app": {"url": f"{WEB_APP_URL}/client.html"}}
            ]]
        }
    )

async def workouts(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /workouts"""
    await update.message.reply_text(
        "Открываю тренировки...",
        reply_markup={
            "inline_keyboard": [[
                {"text": "💪 Мои тренировки", 
                 "web_app": {"url": f"{WEB_APP_URL}/client.html"}}
            ]]
        }
    )

async def admin(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /admin"""
    await update.message.reply_text(
        "Открываю панель администратора...",
        reply_markup={
            "inline_keyboard": [[
                {"text": "⚙️ Админ-панель", 
                 "web_app": {"url": f"{WEB_APP_URL}/admin.html"}}
            ]]
        }
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик команды /help"""
    await update.message.reply_text(
        "📱 Как использовать бота:\n\n"
        "1. Нажмите кнопку внизу 'Открыть приложение'\n"
        "2. Зарегистрируйтесь или войдите\n"
        "3. Заполните профиль\n"
        "4. Получите программу от тренера\n\n"
        "Команды:\n"
        "/start - Начать работу\n"
        "/register - Зарегистрироваться\n"
        "/profile - Открыть профиль\n"
        "/workouts - Мои тренировки\n"
        "/admin - Админ-панель\n"
        "/help - Эта справка"
    )

def main():
    """Запуск бота"""
    logger.info("🤖 Запуск Telegram бота...")
    logger.info(f"🌐 Web App URL: {WEB_APP_URL}")
    
    if not BOT_TOKEN or BOT_TOKEN == "YOUR_BOT_TOKEN":
        logger.error("❌ BOT_TOKEN не установлен! Установите в Secrets или обновите bot.py")
        return
    
    # Запуск keep-alive сервера (для Replit)
    if KEEP_ALIVE_AVAILABLE:
        try:
            keep_alive.keep_alive()
            logger.info("✅ Keep-alive сервер запущен")
        except Exception as e:
            logger.warning(f"⚠️ Не удалось запустить keep-alive: {e}")
    
    try:
        app = Application.builder().token(BOT_TOKEN).build()
        
        # Регистрация обработчиков команд
        app.add_handler(CommandHandler("start", start))
        app.add_handler(CommandHandler("register", register))
        app.add_handler(CommandHandler("profile", profile))
        app.add_handler(CommandHandler("workouts", workouts))
        app.add_handler(CommandHandler("admin", admin))
        app.add_handler(CommandHandler("help", help_command))
        
        logger.info("✅ Бот запущен и готов к работе!")
        logger.info("📝 Бот работает на Replit - будет работать постоянно")
        
        # Запуск бота (polling для Replit)
        app.run_polling(
            allowed_updates=Update.ALL_TYPES,
            drop_pending_updates=True  # Игнорировать старые обновления при перезапуске
        )
    except Exception as e:
        logger.error(f"❌ Ошибка запуска бота: {e}")
        raise

if __name__ == '__main__':
    main()

