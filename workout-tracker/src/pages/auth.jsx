import React, {useState} from 'react'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('login'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = mode === 'login' ? '/api/login' : '/api/register';
    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      if (mode === 'login') {
        localStorage.setItem('token', data.token);
        onAuth(data.token, username);
      } else {
        setMode('login');
        setError('Registered! Please log in.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 250, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" style={{marginBottom: 6}} required />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" style={{marginBottom: 6}} required />
        <button type="submit" style={{ marginTop: 10, width: 80, justifyContent: 'center', display: 'flex'}}>{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ marginTop: 10 }}>
        {mode === 'login' ? 'Need an account? Register here' : 'Have an account? Login here '}
      </button>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
}

