import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_ADDRESS } from './server_add';

function DeviceData({ userId }) {
  const [devices, setDevices] = useState([]); // List of devices
  const [selectedDevEui, setSelectedDevEui] = useState(''); // Selected devEUI
  const [dataEntries, setDataEntries] = useState([]); // Data entries for the selected device
  const [error, setError] = useState('');
  let interval = null;

  // Fetch list of devices for the logged-in user
  useEffect(() => {
    async function fetchDevices() {
      try {
        // Clear Interval of 30s
        // clearInterval(interval)
        const response = await axios.get(`http://${SERVER_ADDRESS}/devices/?user_id=${userId}`);
        setDevices(response.data);
      } catch (err) {
        console.error('Failed to fetch devices:', err);
        setError('Failed to fetch devices');
      }
    }
    // First Call
    fetchDevices(); 

    /* Wait 30000ms (30s) to make new request 
    interval = setInterval(fetchDeviceData(), 30000);*/
  }, [userId]);


  

  // Fetch device data when devEui changes
  const fetchDeviceData = async (devEui) => {
    try {
      const response = await axios.get(`http://${SERVER_ADDRESS}/list-device-data/${devEui}/?user_id=${userId}`);
      setDataEntries(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch device data:', err);
      setError('Failed to fetch device data');
      setDataEntries([]);
    }
  };

  // Download CSV for the selected device
  const downloadCsv = async () => {
    if (!selectedDevEui) {
      setError('Please select a device first');
      return;
    }
    try {
      const response = await axios.get(
        `http://${SERVER_ADDRESS}/export-device-data/${selectedDevEui}/?user_id=${userId}`,
        { responseType: 'blob' } // Handle as a file download
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedDevEui}_data.csv`); // Filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download CSV:', err);
      setError('Failed to download CSV');
    }
  };

  // Handle devEUI selection change
  const handleDevEuiChange = (e) => {
    const devEui = e.target.value;
    setSelectedDevEui(devEui);
    if (devEui) fetchDeviceData(devEui); // Fetch data for the selected device
  };

  return (
    <div className="p-6 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Device Data</h2>

      {/* Device Selector */}
      <div className="mb-4">
        <label htmlFor="device-select" className="block mb-2 text-lg text-gray-700 dark:text-white">
          Select Device:
        </label>
        <select
          id="device-select"
          value={selectedDevEui}
          onChange={handleDevEuiChange}
          className="w-full px-4 py-2 border rounded dark:text-black"
        >
          <option value="">-- Select a Device --</option>
          {devices.map((device) => (
            <option key={device.dev_eui} value={device.dev_eui}>
              {device.name} ({device.dev_eui})
            </option>
          ))}
        </select>
      </div>

      {/* Download CSV Button */}
      <button
        onClick={downloadCsv}
        className="mb-4 bg-blue-500 hover:bg-blue-600 text-white dark:bg-darkBtn px-4 py-2 rounded dark:text-bgDashDark hover:ring-1 ring-white"
      >
        Download CSV
      </button>

      {/* Data Table */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b bg-gray-200 dark:bg-mainDarkBgcolor">ID</th>
              <th className="p-4 border-b bg-gray-200 dark:bg-mainDarkBgcolor">Received At</th>
              <th className="p-4 border-b bg-gray-200 dark:bg-mainDarkBgcolor">Data</th>
            </tr>
          </thead>
          <tbody>
            {dataEntries.length > 0 ? (
              dataEntries.map((entry) => {





                /* Date Formatted */
                let date = new Date(entry.received_at);

                let options = {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                };

                let formattedDate = new Intl.DateTimeFormat('en-EN', options).format(date);
                /* End of Date Formatted */


                
                /* Parameters Formatted */
                let formattedParams = Object.entries(entry.data)
                                            .map(([key,value]) => `[${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}]`)
                                            .join(' - ');
                console.log(formattedParams);


                                                                                    
                /* End of Parameters Formatted */




                return (
                <tr key={entry.id} className="hover:bg-gray-100 dark:hover:bg-mainDarkBgcolor">
                  <td className="p-4 border-b">{entry.id}</td>
                  <td className="p-4 border-b">{formattedDate}</td>
                  <td className="p-4 border-b">{formattedParams}</td>
                </tr>
              )})
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500 dark:text-white">
                  No data available. Please select a device.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeviceData;
