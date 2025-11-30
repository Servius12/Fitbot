<<<<<<< HEAD
#!/usr/bin/env python3
"""
Keep-alive скрипт для Replit
Предотвращает остановку Replit при неактивности
"""

from flask import Flask
from threading import Thread
import time

app = Flask('')

@app.route('/')
def home():
    return "Bot is alive!"

def run():
    app.run(host='0.0.0.0', port=8080)

def keep_alive():
    """Запускает веб-сервер в отдельном потоке"""
    t = Thread(target=run)
    t.daemon = True
    t.start()
    return t

if __name__ == '__main__':
    keep_alive()
    # Бот будет работать в основном потоке
    # Этот скрипт можно импортировать в bot.py

=======
#!/usr/bin/env python3
"""
Keep-alive скрипт для Replit
Предотвращает остановку Replit при неактивности
"""

from flask import Flask
from threading import Thread
import time

app = Flask('')

@app.route('/')
def home():
    return "Bot is alive!"

def run():
    app.run(host='0.0.0.0', port=8080)

def keep_alive():
    """Запускает веб-сервер в отдельном потоке"""
    t = Thread(target=run)
    t.daemon = True
    t.start()
    return t

if __name__ == '__main__':
    keep_alive()
    # Бот будет работать в основном потоке
    # Этот скрипт можно импортировать в bot.py

>>>>>>> 7be83a930b4950ac7ae2256d4f2ec34c8c08c5e7
