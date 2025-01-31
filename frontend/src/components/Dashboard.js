import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import DeviceRegistration from './DeviceRegistration';
import DeviceData from './DeviceData';

function Dashboard({ userName, userId, setUserId }) {
  const [activeComponent, setActiveComponent] = useState('deviceRegistration');
  const [selectedDeviceEui, setSelectedDeviceEui] = useState(null); // For viewing device-specific data

  // État pour suivre le thème actuel
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Récupérer la préférence de thème dans le localStorage
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Effet pour appliquer la classe au <html> en fonction de l'état
  useEffect(() => {
    const rootElement = document.documentElement;
    if (isDarkMode) {
      rootElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      rootElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Fonction de basculement
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  

  const renderComponent = () => {
    switch (activeComponent) {
      case 'deviceRegistration':
        return <DeviceRegistration userId={userId} />;
      case 'deviceData':
        return <DeviceData devEui={selectedDeviceEui} userId={userId} />;
      case 'logout':
        setUserId(null);
        return <Navigate to="/" />;
      default:
        return <DeviceRegistration userId={userId} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-bgDashLight dark:bg-bgDashDark">
      {/* Sidebar */}
      <div className="h-screen flex justify-between bg-bgDashLight dark:bg-bgDashDark relative">

        <div className="w-64 bg-bgDashLight  text-fgDashDark flex flex-col p-6 shadow-xl dark:bg-bgDashDark dark:fg-fgDashLight">
          <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
          <nav className="space-y-4">
            <button
              onClick={() => setActiveComponent('deviceRegistration')}
              className={`block py-3 px-4 text-left rounded transition-all duration-300 ${
              activeComponent === 'deviceRegistration' ? 'text-darkBtn dark:text-bgDashDark bg-dashBtnBg dark:bg-darkBtn shadow-md' : 'hover:bg-dashBtnBg dark:hover:bg-darkBtn dark:hover:text-bgDashDark'
              }`}
            >
              <span className="text-lg font-medium">Register Device</span>
            </button>
            <button
              onClick={() => setActiveComponent('deviceData')}
              className={`block py-3 px-4 text-left rounded transition-all duration-300 ${
                activeComponent === 'deviceData' ? 'text-darkBtn dark:text-bgDashDark bg-dashBtnBg dark:bg-darkBtn shadow-md' : 'hover:bg-dashBtnBg dark:hover:bg-darkBtn dark:hover:text-bgDashDark'
              }`}
            >
              <span className="text-lg font-medium">View Device Data</span>
            </button>
            <button
              onClick={() => setActiveComponent('logout')}
              className="block py-3 px-4 text-left rounded hover:bg-red-500 dark:hover:bg-warningBtnHover transition-all duration-300"
            >
              <span className="text-lg font-medium text-warningBtn">Logout</span>
            </button>



            {/* Darkmode Toggle */}
            <div className="transition-colors duration-500 flex flex-col t text-left absolute bottom-10">
              <button
                onClick={toggleTheme}
                className="w-36 px-4 py-2 text-sm font-medium rounded bg-dashBtnBg dark:bg-darkBtn text-white dark:text-bgDashDark"
              >
                {isDarkMode ? 'Dark' : 'Light'}
              </button>
              <p className="mt-4">Try to toggle between light and dark mode.</p>
            </div>

          </nav>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-gray-200 dark:bg-mainDarkBgcolor text-black dark:text-fgDashDark py-6 px-8 shadow-md">
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="text-bgDashLight dark:text-bgDashDark">{userName}</span>!
          </h1>
        </div>

        {/* Rendered Component */}
        <div className="flex-1 p-8 overflow-auto bg-gray-100 dark:bg-uiBgcolor">
          <div className="rounded-lg bg-white dark:bg-bgDashDark shadow-lg p-6 ring-1 ring-white">{renderComponent()}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
