import { useState } from 'react';
import { motion } from 'framer-motion';

const JobCard = ({ job, deleteJob, updateStatus, updateDeadline }) => {
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [newDeadline, setNewDeadline] = useState(job.deadline || '');
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Applied': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'Interview': return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'Offer': return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'Rejected': return 'bg-gradient-to-r from-red-500 to-red-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Applied': return '📧';
      case 'Interview': return '🎤';
      case 'Offer': return '🎉';
      case 'Rejected': return '💔';
      default: return '📝';
    }
  };

  const getCompanyImage = (companyName) => {
    const images = {
      'google': 'https://logo.clearbit.com/google.com',
      'microsoft': 'https://logo.clearbit.com/microsoft.com',
      'amazon': 'https://logo.clearbit.com/amazon.com',
      'apple': 'https://logo.clearbit.com/apple.com',
      'meta': 'https://logo.clearbit.com/meta.com',
      'netflix': 'https://logo.clearbit.com/netflix.com',
      'default': `https://ui-avatars.com/api/?name=${companyName.replace(/ /g, '+')}&background=0D8F81&color=fff&bold=true&length=2`
    };
    return images[companyName.toLowerCase()] || images.default;
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSetDeadline = () => {
    if (newDeadline) {
      updateDeadline(job.id, newDeadline);
      setShowDeadlinePicker(false);
    }
  };

  const daysUntil = getDaysUntilDeadline(job.deadline);
  const isExpired = isDeadlinePassed(job.deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
    >
      {/* Gradient top bar */}
      <div className={`h-2 ${getStatusColor(job.status)}`}></div>
      
      <div className="p-6">
        {/* Header with logo and actions */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <motion.img
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              src={getCompanyImage(job.company)}
              alt={job.company}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${job.company.replace(/ /g, '+')}&background=0D8F81&color=fff&bold=true&length=2`;
              }}
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{job.company}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{job.position}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => deleteJob(job.id)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getStatusIcon(job.status)}</span>
            <span className={`${getStatusColor(job.status)} text-white px-4 py-1.5 rounded-full text-sm font-semibold inline-block shadow-lg`}>
              {job.status}
            </span>
          </div>
        </div>
        
        {/* Date Applied */}
        {job.date && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Applied: {job.date}</span>
          </div>
        )}
        
        {/* Deadline Section */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">⏰ Deadline</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowDeadlinePicker(!showDeadlinePicker)}
              className="text-xs text-cyan-500 hover:text-cyan-600 dark:text-cyan-400"
            >
              {job.deadline ? 'Edit' : '+ Add'}
            </motion.button>
          </div>
          
          {job.deadline ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-2 rounded-lg text-sm ${
                isExpired 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                  : daysUntil <= 3 
                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>📅 {job.deadline}</span>
                <span className="font-bold">
                  {isExpired 
                    ? 'Expired!' 
                    : daysUntil === 0 
                      ? 'Today!' 
                      : `${daysUntil} days left`}
                </span>
              </div>
            </motion.div>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-sm italic">No deadline set</p>
          )}
          
          {/* Deadline Picker */}
          {showDeadlinePicker && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 space-y-2"
            >
              <input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                min={new Date().toISOString().split('T')[0]}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSetDeadline}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded-lg text-sm transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowDeadlinePicker(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 px-3 py-1 rounded-lg text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Notes */}
        {job.notes && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-gray-600 dark:text-gray-300 text-sm flex items-start gap-2">
              <span className="text-gray-400">📝</span>
              <span>{job.notes}</span>
            </p>
          </motion.div>
        )}
        
        {/* Quick Status Update Buttons */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick update:</p>
          <div className="flex gap-2">
            {job.status !== 'Applied' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateStatus(job.id, 'Applied')}
                className="flex-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 transition"
              >
                ⬅️ Applied
              </motion.button>
            )}
            {job.status !== 'Interview' && job.status !== 'Rejected' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateStatus(job.id, 'Interview')}
                className="flex-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded hover:bg-yellow-200 transition"
              >
                🎤 Interview
              </motion.button>
            )}
            {job.status !== 'Offer' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateStatus(job.id, 'Offer')}
                className="flex-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded hover:bg-green-200 transition"
              >
                🎉 Offer
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
