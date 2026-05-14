import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import JobForm from "./components/JobForm";
import JobCard from "./components/JobCard";
import AdvancedDashboard from "./components/AdvancedDashboard";
import { storageService } from "./services/storageService";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

function App() {
  const [jobs, setJobs] = useState([]);
  const [viewMode, setViewMode] = useState('dashboard'); // dashboard, cards
  const [searchTerm, setSearchTerm] = useState('');

  // Load from localStorage with advanced storage
  useEffect(() => {
    const savedJobs = storageService.load('jobs');
    if (savedJobs) {
      setJobs(savedJobs);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    storageService.save('jobs', jobs);
  }, [jobs]);

  const addJob = (job) => {
    const newJob = {
      ...job,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setJobs([newJob, ...jobs]);
  };

  const deleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const updateStatus = (id, newStatus) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, status: newStatus, updatedAt: new Date().toISOString() } : job
    ));
  };

  const updateDeadline = (id, deadline) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, deadline: deadline, updatedAt: new Date().toISOString() } : job
    ));
  };

  const filteredJobs = jobs.filter(job =>
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Toaster position="top-right" />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* View Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setViewMode('dashboard')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              viewMode === 'dashboard'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            📊 Dashboard View
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              viewMode === 'cards'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            🃏 Cards View
          </button>
        </div>
        
        {/* Advanced Dashboard */}
        {viewMode === 'dashboard' && jobs.length > 0 && (
          <AdvancedDashboard jobs={jobs} />
        )}
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search by company or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white transition-all duration-300"
          />
        </div>
        
        {/* Add Job Form */}
        <div className="mb-8">
          <JobForm addJob={addJob} />
        </div>
        
        {/* Job Cards Grid with Animations */}
        {viewMode === 'cards' && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <JobCard
                      job={job}
                      deleteJob={deleteJob}
                      updateStatus={updateStatus}
                      updateDeadline={updateDeadline}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-6xl mb-4"
                >
                  🎯
                </motion.div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {jobs.length === 0 ? 'No applications yet. Add your first one!' : 'No matching applications found.'}
                </p>
              </div>
            )}
          </>
        )}
        
        {/* Storage Info */}
        {jobs.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            💾 Storage used: {storageService.getStorageSize()} | 
            📊 Total applications: {jobs.length}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
