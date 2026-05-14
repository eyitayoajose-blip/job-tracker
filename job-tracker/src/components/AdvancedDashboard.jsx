import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { exportService } from '../services/exportService';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../hooks/useNotification';
import toast, { Toaster } from 'react-hot-toast';

const AdvancedDashboard = ({ jobs }) => {
  const [metrics, setMetrics] = useState(null);
  const [insights, setInsights] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { requestPermission, sendNotification } = useNotification();
  
  useEffect(() => {
    if (jobs.length > 0) {
      setMetrics(analyticsService.calculateMetrics(jobs));
      setInsights(analyticsService.generateInsights(jobs));
    }
  }, [jobs]);
  
  const handleExport = async (type) => {
    switch(type) {
      case 'pdf':
        toast.loading('Generating PDF...');
        await exportService.exportToPDF('dashboard-content', `job-report-${new Date().toISOString().split('T')[0]}`);
        toast.dismiss();
        toast.success('PDF exported successfully!');
        break;
      case 'json':
        exportService.exportToJSON(jobs);
        toast.success('JSON exported successfully!');
        break;
      case 'excel':
        exportService.exportToExcel(jobs);
        toast.success('Excel exported successfully!');
        break;
    }
    setShowExportMenu(false);
  };
  
  const requestNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      sendNotification('Notifications Enabled!', {
        body: 'You will now receive deadline reminders.',
        icon: '🔔'
      });
      toast.success('Notifications enabled!');
    } else {
      toast.error('Please allow notifications for reminders.');
    }
  };
  
  if (!metrics) return null;
  
  return (
    <>
      <Toaster position="top-right" />
      
      {/* Export Menu */}
      <div className="fixed top-20 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            📊 Export Report
          </button>
          
          <AnimatePresence>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden min-w-[200px]"
              >
                <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2">
                  📄 Export as PDF
                </button>
                <button onClick={() => handleExport('excel')} className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2">
                  📊 Export as Excel
                </button>
                <button onClick={() => handleExport('json')} className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2">
                  💾 Export as JSON
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Notification Button */}
      <button
        onClick={requestNotifications}
        className="fixed bottom-20 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      >
        🔔
      </button>
      
      <div id="dashboard-content" className="space-y-6 p-6">
        {/* AI Insights Section */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🤖 AI Insights
            </h3>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-white text-lg"
                >
                  {insight}
                </motion.p>
              ))}
            </div>
            
            {/* Success Prediction */}
            {metrics.successPrediction && (
              <div className="mt-4 p-4 bg-white/20 rounded-xl">
                <p className="text-white font-semibold">🎯 Success Prediction</p>
                <p className="text-white text-sm mt-1">{metrics.successPrediction.message}</p>
                {metrics.successPrediction.rate && (
                  <div className="mt-2 w-full bg-white/30 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${metrics.successPrediction.rate}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
        
        {/* Stats Grid with Animations */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Apps', value: metrics.total, color: 'from-purple-500 to-purple-600', icon: '📊' },
            { label: 'Applied', value: metrics.applied, color: 'from-blue-500 to-blue-600', icon: '📧' },
            { label: 'Interview', value: metrics.interview, color: 'from-yellow-500 to-yellow-600', icon: '🎤' },
            { label: 'Offer', value: metrics.offer, color: 'from-green-500 to-green-600', icon: '🎉' },
            { label: 'Rejected', value: metrics.rejected, color: 'from-red-500 to-red-600', icon: '💔' },
            { label: 'Success Rate', value: `${metrics.overallSuccessRate}%`, color: 'from-pink-500 to-pink-600', icon: '🏆' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 shadow-xl text-white`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-xs opacity-80">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Conversion Metrics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">📈 Conversion Rates</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Application → Interview</span>
                  <span className="font-bold text-blue-600">{metrics.interviewRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.interviewRate}%` }}
                    transition={{ duration: 1 }}
                    className="bg-blue-500 h-3 rounded-full"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Interview → Offer</span>
                  <span className="font-bold text-green-600">{metrics.offerRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.offerRate}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="bg-green-500 h-3 rounded-full"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Overall Success</span>
                  <span className="font-bold text-purple-600">{metrics.overallSuccessRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.overallSuccessRate}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="bg-purple-500 h-3 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Response Time */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">⏱️ Performance Metrics</h3>
            <div className="text-center">
              <div className="text-6xl font-bold text-cyan-500 mb-2">
                {metrics.avgResponseTime}
              </div>
              <p className="text-gray-600 dark:text-gray-300">Average Response Time (days)</p>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Quality Score</span>
                <span className="font-bold text-green-600">
                  {metrics.overallSuccessRate > 30 ? 'Excellent' : metrics.overallSuccessRate > 15 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancedDashboard;
