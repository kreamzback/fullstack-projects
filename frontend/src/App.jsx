import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import TodoList from './TodoList';
import AdminPanel from './AdminPanel';
import './App.css';

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const currentUser = token ? parseJwt(token) : null;

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark">T</div>
          <div>
            <h1>Todo App</h1>
            <p>{token ? 'Keep the day in order' : 'Sign in to manage your tasks'}</p>
          </div>
        </div>

        {token && (
          <div className="session-bar">
            <p className="session-copy">
              {currentUser?.role === 'admin' ? 'Admin session' : 'Signed in'}
            </p>
            <button className="btn-secondary" onClick={handleLogout}>
              Log Out
            </button>
            {currentUser?.role === 'admin' && (
              <button
                className="btn-primary"
                onClick={() => setShowAdmin(!showAdmin)}
              >
                {showAdmin ? 'Show Todos' : 'Admin Panel'}
              </button>
            )}
          </div>
        )}
      </header>

      {!token ? (
        <div className="card">
          {isRegistering ? (
            <>
              <Register onRegisterSuccess={() => setIsRegistering(false)} />
              <p className="switch-auth">
                Already have an account?{' '}
                <button className="btn-ghost" onClick={() => setIsRegistering(false)}>
                  Log in here
                </button>
              </p>
            </>
          ) : (
            <>
              <Login onLoginSuccess={handleLoginSuccess} />
              <p className="switch-auth">
                Don't have an account?{' '}
                <button className="btn-ghost" onClick={() => setIsRegistering(true)}>
                  Register here
                </button>
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="card">
          {showAdmin ? <AdminPanel token={token} /> : <TodoList token={token} />}
        </div>
      )}
    </div>
  );
}

export default App;
