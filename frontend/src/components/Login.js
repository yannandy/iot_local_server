import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SERVER_ADDRESS } from './server_add';

function Login({ setUserId, setUserName }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://${SERVER_ADDRESS}/login/`, { email, password });
      setUserId(response.data.user_id);
      setUserName(response.data.first_name);
      //alert('Login successful');
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="bg-sky-100 flex h-screen">
      {/* Left Side: Image */}
      <div className="hidden lg:block w-1/2 h-full">
        <img 
          src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826" 
          alt="Login Visual" 
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right Side: Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome Back</h2>
        <form onSubmit={handleSubmit} method="POST" className="w-full max-w-md">
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-600 mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-gray-600">
          Don't have an account? <a href="/register" className="text-indigo-500 hover:underline">Register here</a>.
        </div>
      </div>
    </div>
  );
}

export default Login;
