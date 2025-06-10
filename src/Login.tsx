import { useState } from 'react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ HARD-CODED LOGIN CREDENTIALS
    const hardcodedUsername = "swift";
    const hardcodedPassword = "takudzwa";

    if (username === hardcodedUsername && password === hardcodedPassword) {
      localStorage.setItem('auth', 'true');
      onLogin(); // login success
    } else {
      alert('❌ Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border mb-4"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border mb-4"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2">
        Login
      </button>
    </form>
  );
}

