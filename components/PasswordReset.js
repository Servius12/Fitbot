<<<<<<< HEAD
function PasswordReset() {
  try {
    const [email, setEmail] = React.useState('');
    const [token, setToken] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [step, setStep] = React.useState('request'); // 'request', 'reset', 'success'
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');

    // Проверка токена в URL
    React.useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const resetToken = urlParams.get('token');
      if (resetToken) {
        setToken(resetToken);
        setStep('reset');
      }
    }, []);

    const handleRequestReset = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setMessage('');

      try {
        if (!email) {
          setError('Введите email');
          setLoading(false);
          return;
        }

        // Ищем пользователя по email
        const result = await trickleListObjects('user_registration', 100);
        const user = result.items.find(r => 
          r.objectData.email && r.objectData.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
          setError('Пользователь с таким email не найден');
          setLoading(false);
          return;
        }

        // Генерируем токен
        const resetToken = 'reset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Токен действителен 1 час

        // Сохраняем токен
        await trickleCreateObject('password_reset_tokens', {
          user_id: user.objectId,
          token: resetToken,
          email: email.toLowerCase(),
          expires_at: expiresAt.toISOString(),
          used: false
        });

        // Отправляем email через Supabase (если настроен)
        if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.isAvailable()) {
          const client = window.SUPABASE_CONFIG.getClient();
          const resetUrl = `${window.location.origin}/reset-password.html?token=${resetToken}`;
          
          // Используем Supabase Edge Function для отправки email
          // Или можно использовать встроенную функцию Supabase Auth
          try {
            // Простой способ - показать ссылку (для демо)
            // В продакшене используйте Supabase Edge Functions или внешний сервис
            setMessage(`Ссылка для сброса пароля: ${resetUrl}\n\nСкопируйте эту ссылку и откройте в браузере.`);
          } catch (err) {
            console.error('Ошибка отправки email:', err);
            setMessage(`Ссылка для сброса пароля: ${resetUrl}\n\nСкопируйте эту ссылку и откройте в браузере.`);
          }
        } else {
          // Fallback - показываем ссылку
          const resetUrl = `${window.location.origin}/reset-password.html?token=${resetToken}`;
          setMessage(`Ссылка для сброса пароля: ${resetUrl}\n\nСкопируйте эту ссылку и откройте в браузере.`);
        }

        setStep('success');
      } catch (error) {
        console.error('Error requesting reset:', error);
        setError('Ошибка при запросе сброса пароля. Попробуйте еще раз.');
      } finally {
        setLoading(false);
      }
    };

    const handleResetPassword = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        if (newPassword !== confirmPassword) {
          setError('Пароли не совпадают');
          setLoading(false);
          return;
        }

        if (newPassword.length < 6) {
          setError('Пароль должен содержать минимум 6 символов');
          setLoading(false);
          return;
        }

        // Проверяем токен
        const tokensResult = await trickleListObjects('password_reset_tokens', 100);
        const resetTokenData = tokensResult.items.find(t => 
          t.objectData.token === token && 
          !t.objectData.used &&
          new Date(t.objectData.expires_at) > new Date()
        );

        if (!resetTokenData) {
          setError('Токен недействителен или истек');
          setLoading(false);
          return;
        }

        // Обновляем пароль
        await trickleUpdateObject('user_registration', resetTokenData.objectData.user_id, {
          password: newPassword
        });

        // Помечаем токен как использованный
        await trickleUpdateObject('password_reset_tokens', resetTokenData.objectId, {
          used: true
        });

        setStep('success');
        setMessage('Пароль успешно изменен! Теперь вы можете войти с новым паролем.');
      } catch (error) {
        console.error('Error resetting password:', error);
        setError('Ошибка при сбросе пароля. Попробуйте еще раз.');
      } finally {
        setLoading(false);
      }
    };

    if (step === 'success') {
      return (
        <div className="px-4 py-8" data-name="password-reset" data-file="components/PasswordReset.js">
          <div className="card max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="icon-check text-3xl text-green-600"></div>
            </div>
            <h2 className="text-xl font-bold mb-2">Успешно!</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4 whitespace-pre-line">
              {message}
            </p>
            <button 
              onClick={() => window.location.href = 'login.html'}
              className="btn-primary w-full">
              Войти
            </button>
          </div>
        </div>
      );
    }

    if (step === 'reset') {
      return (
        <div className="px-4 py-8" data-name="password-reset" data-file="components/PasswordReset.js">
          <div className="card max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Сброс пароля</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Новый пароль *</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Минимум 6 символов"
                  minLength="6"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Подтверждение пароля *</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Повторите пароль"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full">
                {loading ? 'Сброс...' : 'Сбросить пароль'}
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="px-4 py-8" data-name="password-reset" data-file="components/PasswordReset.js">
        <div className="card max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Восстановление пароля</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Введите email, указанный при регистрации. Мы отправим вам ссылку для сброса пароля.
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="email@example.com"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full">
              {loading ? 'Отправка...' : 'Отправить ссылку для сброса'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="login.html" className="text-sm text-[var(--primary-color)]">
              Вернуться к входу
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('PasswordReset component error:', error);
    return null;
  }
}

=======
function PasswordReset() {
  try {
    const [email, setEmail] = React.useState('');
    const [token, setToken] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [step, setStep] = React.useState('request'); // 'request', 'reset', 'success'
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');

    // Проверка токена в URL
    React.useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const resetToken = urlParams.get('token');
      if (resetToken) {
        setToken(resetToken);
        setStep('reset');
      }
    }, []);

    const handleRequestReset = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setMessage('');

      try {
        if (!email) {
          setError('Введите email');
          setLoading(false);
          return;
        }

        // Ищем пользователя по email
        const result = await trickleListObjects('user_registration', 100);
        const user = result.items.find(r => 
          r.objectData.email && r.objectData.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
          setError('Пользователь с таким email не найден');
          setLoading(false);
          return;
        }

        // Генерируем токен
        const resetToken = 'reset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Токен действителен 1 час

        // Сохраняем токен
        await trickleCreateObject('password_reset_tokens', {
          user_id: user.objectId,
          token: resetToken,
          email: email.toLowerCase(),
          expires_at: expiresAt.toISOString(),
          used: false
        });

        // Отправляем email через Supabase (если настроен)
        if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.isAvailable()) {
          const client = window.SUPABASE_CONFIG.getClient();
          const resetUrl = `${window.location.origin}/reset-password.html?token=${resetToken}`;
          
          // Используем Supabase Edge Function для отправки email
          // Или можно использовать встроенную функцию Supabase Auth
          try {
            // Простой способ - показать ссылку (для демо)
            // В продакшене используйте Supabase Edge Functions или внешний сервис
            setMessage(`Ссылка для сброса пароля: ${resetUrl}\n\nСкопируйте эту ссылку и откройте в браузере.`);
          } catch (err) {
            console.error('Ошибка отправки email:', err);
            setMessage(`Ссылка для сброса пароля: ${resetUrl}\n\nСкопируйте эту ссылку и откройте в браузере.`);
          }
        } else {
          // Fallback - показываем ссылку
          const resetUrl = `${window.location.origin}/reset-password.html?token=${resetToken}`;
          setMessage(`Ссылка для сброса пароля: ${resetUrl}\n\nСкопируйте эту ссылку и откройте в браузере.`);
        }

        setStep('success');
      } catch (error) {
        console.error('Error requesting reset:', error);
        setError('Ошибка при запросе сброса пароля. Попробуйте еще раз.');
      } finally {
        setLoading(false);
      }
    };

    const handleResetPassword = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        if (newPassword !== confirmPassword) {
          setError('Пароли не совпадают');
          setLoading(false);
          return;
        }

        if (newPassword.length < 6) {
          setError('Пароль должен содержать минимум 6 символов');
          setLoading(false);
          return;
        }

        // Проверяем токен
        const tokensResult = await trickleListObjects('password_reset_tokens', 100);
        const resetTokenData = tokensResult.items.find(t => 
          t.objectData.token === token && 
          !t.objectData.used &&
          new Date(t.objectData.expires_at) > new Date()
        );

        if (!resetTokenData) {
          setError('Токен недействителен или истек');
          setLoading(false);
          return;
        }

        // Обновляем пароль
        await trickleUpdateObject('user_registration', resetTokenData.objectData.user_id, {
          password: newPassword
        });

        // Помечаем токен как использованный
        await trickleUpdateObject('password_reset_tokens', resetTokenData.objectId, {
          used: true
        });

        setStep('success');
        setMessage('Пароль успешно изменен! Теперь вы можете войти с новым паролем.');
      } catch (error) {
        console.error('Error resetting password:', error);
        setError('Ошибка при сбросе пароля. Попробуйте еще раз.');
      } finally {
        setLoading(false);
      }
    };

    if (step === 'success') {
      return (
        <div className="px-4 py-8" data-name="password-reset" data-file="components/PasswordReset.js">
          <div className="card max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="icon-check text-3xl text-green-600"></div>
            </div>
            <h2 className="text-xl font-bold mb-2">Успешно!</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4 whitespace-pre-line">
              {message}
            </p>
            <button 
              onClick={() => window.location.href = 'login.html'}
              className="btn-primary w-full">
              Войти
            </button>
          </div>
        </div>
      );
    }

    if (step === 'reset') {
      return (
        <div className="px-4 py-8" data-name="password-reset" data-file="components/PasswordReset.js">
          <div className="card max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Сброс пароля</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Новый пароль *</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Минимум 6 символов"
                  minLength="6"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Подтверждение пароля *</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Повторите пароль"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full">
                {loading ? 'Сброс...' : 'Сбросить пароль'}
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="px-4 py-8" data-name="password-reset" data-file="components/PasswordReset.js">
        <div className="card max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Восстановление пароля</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Введите email, указанный при регистрации. Мы отправим вам ссылку для сброса пароля.
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="email@example.com"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full">
              {loading ? 'Отправка...' : 'Отправить ссылку для сброса'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="login.html" className="text-sm text-[var(--primary-color)]">
              Вернуться к входу
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('PasswordReset component error:', error);
    return null;
  }
}

>>>>>>> 7be83a930b4950ac7ae2256d4f2ec34c8c08c5e7
