import React, { useState } from 'react';
import axios from 'axios';
import { SERVER_ADDRESS } from './server_add';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://${SERVER_ADDRESS}/register/`, formData);
      setSuccess(true);
      setError('');
      alert('Registration successful');
      setFormData({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="bg-sky-100 flex h-screen">
      {/* Left Side: Image */}
      <div className="hidden lg:block w-1/2 h-full">
        <img 
          src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826" 
          alt="Register Visual" 
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right Side: Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Create an Account</h2>
        {success && <p className="text-green-500 mb-4">Registration successful! <a href="/" className="text-indigo-500 underline">Login here</a>.</p>}
        <form onSubmit={handleSubmit} method="POST" className="w-full max-w-md">
          {['email', 'password', 'first_name', 'last_name'].map((field) => (
            <div key={field} className="mb-6">
              <label htmlFor={field} className="block text-gray-600 mb-2 capitalize">
                {field.replace('_', ' ')}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                required
              />
            </div>
          ))}

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-gray-600">
          Already have an account? <a href="/" className="text-indigo-500 hover:underline">Login here</a>.
        </div>
      </div>
    </div>
  );
}

export default Register;
