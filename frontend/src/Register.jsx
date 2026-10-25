import { useState } from 'react';
import axios from 'axios';

function Register({ onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      await axios.post('http://localhost:3000/auth/register', {
        email,
        password,
      });

      setSuccessMsg('Registration successful! You can log in now.');
      setEmail('');
      setPassword('');

      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div>
      <h2>Create an account</h2>
      <p className="card-lead">A few details and you can start your list.</p>
      {error && <p className="alert alert-error">{error}</p>}
      {successMsg && <p className="alert alert-ok">{successMsg}</p>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn-primary" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Register;
