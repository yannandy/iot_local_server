// src/components/DeviceRegistration.js
import React, { useState } from 'react';
import axios from 'axios';
import { SERVER_ADDRESS } from './server_add';

function DeviceRegistration({ userId }) {
  const [devEui, setDevEui] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://${SERVER_ADDRESS}/register-device/`, { user_id: userId, dev_eui: devEui, name });
      setMessage('Device registered successfully');
      setError('');
    } catch (err) {
      setError('Failed to register device');
    }
  };

  return (
    <div className="p-6 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Register a Device</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Device EUI</label>
          <input
            type="text"
            value={devEui}
            onChange={(e) => setDevEui(e.target.value)}
            className="w-full px-4 py-2 border rounded text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Device Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded text-black"
          />
        </div>
        <button type="submit" className="bg-normalBtn hover:bg-blue-600 dark:bg-darkBtn text-white dark:text-bgDashDark hover:ring-1 ring-white transition-all duration-300 py-2 px-4 rounded">
          Register
        </button>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}

export default DeviceRegistration;
