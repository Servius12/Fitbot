# ⚡ Быстрый старт - 5 минут

## 🎯 Что нужно сделать:

### 1️⃣ Загрузить на GitHub (2 минуты)

```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/fitness-trainer-app.git
git push -u origin main
```

### 2️⃣ Развернуть на Netlify (2 минуты)

1. Зайдите на https://www.netlify.com
2. "Add new site" → "Import from GitHub"
3. Выберите репозиторий
4. Build command: **пусто**
5. Publish directory: **`.`**
6. "Deploy site"
7. **Скопируйте URL!**

### 3️⃣ Настроить Telegram бота (1 минута)

1. Откройте [@BotFather](https://t.me/BotFather)
2. `/setmenubutton` → выберите бота
3. URL: `https://ваш-домен.netlify.app/register.html`
4. `/setcommands` → вставьте команды из README.md

### 4️⃣ Запустить бота

```powershell
pip install -r requirements.txt
python bot.py
```

**Готово! 🎉**

---

📖 **Подробная инструкция:** См. `DEPLOY_INSTRUCTIONS.md`

