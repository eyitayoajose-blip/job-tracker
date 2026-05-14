import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <nav className="bg-slate-800 dark:bg-slate-900 shadow-lg p-5 flex justify-between items-center transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-bold text-cyan-400 dark:text-cyan-300">
          Job Tracker
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Track Your Success</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={toggleTheme}
          className="bg-gray-700 dark:bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-500 transition-all duration-300 text-white flex items-center gap-2"
        >
          {isDark ? (
            <>
              <span>☀️</span> Light Mode
            </>
          ) : (
            <>
              <span>🌙</span> Dark Mode
            </>
          )}
        </button>
        
        <button className="bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-600 transition text-white font-semibold">
          Track Success
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
