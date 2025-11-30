function LoginForm() {
  try {
    const [credentials, setCredentials] = React.useState({ username: '', password: '' });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        if (credentials.username === 'admin123' && credentials.password === 'admin123') {
          sessionStorage.setItem('admin_authenticated', 'true');
          window.location.href = 'admin.html';
          return;
        }

        const result = await trickleListObjects('user_registration', 100);
        const user = result.items.find(r => {
          const data = r.objectData;
          return (data.username || data.Username) === credentials.username && 
                 (data.password || data.Password) === credentials.password &&
                 (data.status || data.Status) === 'approved';
        });

        if (user) {
          const data = user.objectData;
          sessionStorage.setItem('authenticated_user', JSON.stringify({
            userId: user.objectId,
            username: data.username || data.Username,
            role: data.approved_role || data.ApprovedRole
          }));
          window.location.href = 'index.html';
        } else {
          setError('Неверные логин или пароль, либо ваша заявка еще не одобрена');
        }
      } catch (err) {
        console.error('Login error:', err);
        setError('Ошибка входа');
      }
      setLoading(false);
    };

    return (
      <div className="min-h-screen flex items-center justify-center px-4" data-file="components/LoginForm.js">
        <div className="card max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[var(--primary-color)] rounded-xl flex items-center justify-center mx-auto mb-3">
              <div className="icon-dumbbell text-3xl text-white"></div>
            </div>
            <h1 className="text-2xl font-bold">Вход в систему</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Для пользователей и администраторов</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Логин</label>
              <input 
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <input 
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Вход...' : 'Войти'}
            </button>
            <div className="text-center space-y-2 mt-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Нет аккаунта? <a href="register.html" className="text-[var(--primary-color)] font-medium">Регистрация</a>
              </p>
              <p className="text-sm">
                <a href="reset-password.html" className="text-[var(--primary-color)] font-medium">Забыли пароль?</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('LoginForm error:', error);
    return null;
  }
}
