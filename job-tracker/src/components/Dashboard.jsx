import { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = ({ jobs, setJobs }) => {

  const [showImport, setShowImport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [chartType, setChartType] = useState('pie'); // pie, bar, line
  
  // Filter jobs based on search and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const applied = filteredJobs.filter(job => job.status === "Applied").length;
  const interview = filteredJobs.filter(job => job.status === "Interview").length;
  const offer = filteredJobs.filter(job => job.status === "Offer").length;
  const rejected = filteredJobs.filter(job => job.status === "Rejected").length;
  const total = filteredJobs.length;
  
  // Calculate success rates
  const interviewRate = total > 0 ? ((interview / total) * 100).toFixed(1) : 0;
  const offerRate = total > 0 ? ((offer / total) * 100).toFixed(1) : 0;
  const rejectionRate = total > 0 ? ((rejected / total) * 100).toFixed(1) : 0;

  // Data for pie chart
  const pieData = [
    { name: 'Applied', value: applied, color: '#3b82f6' },
    { name: 'Interview', value: interview, color: '#f59e0b' },
    { name: 'Offer', value: offer, color: '#10b981' },
    { name: 'Rejected', value: rejected, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Data for bar chart
  const barData = [
    { stage: 'Applied', count: applied, color: '#3b82f6' },
    { stage: 'Interview', count: interview, color: '#f59e0b' },
    { stage: 'Offer', count: offer, color: '#10b981' },
    { stage: 'Rejected', count: rejected, color: '#ef4444' }
  ];

  // Get weekly data (last 4 weeks)
  const getWeeklyData = () => {
    const weeks = {};
    const today = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7));
      const weekKey = `Week ${4 - i}`;
      weeks[weekKey] = 0;
    }
    
    filteredJobs.forEach(job => {
      if (job.date) {
        const jobDate = new Date(job.date);
        const diffDays = Math.floor((today - jobDate) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.floor(diffDays / 7);
        if (weekIndex >= 0 && weekIndex < 4) {
          const weekKey = `Week ${4 - weekIndex}`;
          weeks[weekKey] = (weeks[weekKey] || 0) + 1;
        }
      }
    });
    
    return Object.entries(weeks).map(([week, count]) => ({ week, count }));
  };

  const lineData = getWeeklyData();

  // Export to CSV function
  const exportToCSV = () => {
    if (jobs.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = ["Company", "Position", "Status", "Date Applied", "Notes"];
    const csvRows = [headers];
    jobs.forEach(job => {
      csvRows.push([
        `"${job.company || ''}"`,
        `"${job.position || ''}"`,
        `"${job.status || ''}"`,
        `"${job.date || ''}"`,
        `"${(job.notes || '').replace(/"/g, '""')}"`
      ]);
    });
    
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `job-applications-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert("✅ Export successful! Check your downloads folder.");
  };

  // Import from CSV function
  const importFromCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split("\n");
      
      const newJobs = [];
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].trim() === "") continue;
        
        const values = [];
        let inQuote = false;
        let currentValue = "";
        
        for (let char of rows[i]) {
          if (char === '"') {
            inQuote = !inQuote;
          } else if (char === "," && !inQuote) {
            values.push(currentValue.replace(/^"|"$/g, ''));
            currentValue = "";
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.replace(/^"|"$/g, ''));
        
        if (values.length >= 4) {
          newJobs.push({
            id: Date.now() + i,
            company: values[0] || "Unknown",
            position: values[1] || "Unknown",
            status: values[2] || "Applied",
            date: values[3] || new Date().toISOString().split("T")[0],
            notes: values[4] || ""
          });
        }
      }
      
      if (newJobs.length > 0) {
        const updatedJobs = [...jobs, ...newJobs];
        setJobs(updatedJobs);
        localStorage.setItem("jobs", JSON.stringify(updatedJobs));
        alert(`✅ Imported ${newJobs.length} applications successfully!`);
      } else {
        alert("No valid data found in CSV file.");
      }
      setShowImport(false);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center px-6 flex-wrap gap-3">
        <div className="flex gap-3">
          {jobs.length > 0 && (
            <>
              <button 
                onClick={() => setShowImport(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
              >
                <span>📤</span> Import CSV
              </button>
              <button 
                onClick={exportToCSV}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
              >
                <span>📥</span> Export CSV
              </button>
            </>
          )}
        </div>
        
        {/* Search Box */}
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search company or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 w-64"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status Filter Buttons */}
      {jobs.length > 0 && (
        <div className="flex gap-2 px-6 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              statusFilter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({jobs.length})
          </button>
          <button
            onClick={() => setStatusFilter('Applied')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              statusFilter === 'Applied' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Applied ({jobs.filter(j => j.status === 'Applied').length})
          </button>
          <button
            onClick={() => setStatusFilter('Interview')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              statusFilter === 'Interview' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Interview ({jobs.filter(j => j.status === 'Interview').length})
          </button>
          <button
            onClick={() => setStatusFilter('Offer')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              statusFilter === 'Offer' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Offer ({jobs.filter(j => j.status === 'Offer').length})
          </button>
          <button
            onClick={() => setStatusFilter('Rejected')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              statusFilter === 'Rejected' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Rejected ({jobs.filter(j => j.status === 'Rejected').length})
          </button>
        </div>
      )}

      {/* Filter Info Badge */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="px-6">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg inline-flex items-center gap-2">
            <span>🔍</span>
            <span>
              Showing {total} of {jobs.length} applications
              {searchTerm && ` matching "${searchTerm}"`}
              {statusFilter !== 'all' && ` with status "${statusFilter}"`}
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              Clear all filters ✕
            </button>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Import CSV File</h3>
            <p className="text-gray-600 mb-4">Select a CSV file with columns: Company, Position, Status, Date, Notes</p>
            <input 
              type="file" 
              accept=".csv" 
              onChange={importFromCSV}
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowImport(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="grid md:grid-cols-5 gap-6 p-6">
        <div className="bg-blue-500 p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-2xl font-bold">Applied</h2>
          <p className="text-4xl mt-4">{applied}</p>
        </div>

        <div className="bg-yellow-500 p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-2xl font-bold">Interview</h2>
          <p className="text-4xl mt-4">{interview}</p>
        </div>

        <div className="bg-green-500 p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-2xl font-bold">Offer</h2>
          <p className="text-4xl mt-4">{offer}</p>
        </div>

        <div className="bg-red-500 p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-2xl font-bold">Rejected</h2>
          <p className="text-4xl mt-4">{rejected}</p>
        </div>

        <div className="bg-purple-500 p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-2xl font-bold">Total</h2>
          <p className="text-4xl mt-4">{total}</p>
        </div>
      </div>

      {/* Charts Section */}
      {total > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-xl mx-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">📊 Visual Analytics</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('pie')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  chartType === 'pie' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Pie Chart
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  chartType === 'bar' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Bar Chart
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  chartType === 'line' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Trends
              </button>
            </div>
          </div>
          
          <div className="h-80">
            {chartType === 'pie' && pieData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8">
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'line' && lineData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Analytics Cards */}
      {total > 0 && (
        <>
          <div className="grid md:grid-cols-3 gap-6 px-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-semibold opacity-90">📈 Interview Rate</h3>
              <p className="text-5xl font-bold mt-2">{interviewRate}%</p>
              <p className="text-sm mt-2 opacity-80">{interview} out of {total} applications</p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-semibold opacity-90">🎯 Offer Rate</h3>
              <p className="text-5xl font-bold mt-2">{offerRate}%</p>
              <p className="text-sm mt-2 opacity-80">{offer} out of {total} applications</p>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-semibold opacity-90">📊 Rejection Rate</h3>
              <p className="text-5xl font-bold mt-2">{rejectionRate}%</p>
              <p className="text-sm mt-2 opacity-80">{rejected} out of {total} applications</p>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="bg-white p-6 rounded-2xl shadow-xl mx-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Application Pipeline</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Applied → Interview</span>
                  <span className="text-gray-600">{interviewRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                       style={{ width: `${interviewRate}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Interview → Offer</span>
                  <span className="text-gray-600">
                    {interview > 0 ? ((offer / interview) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-yellow-500 h-3 rounded-full transition-all duration-500" 
                       style={{ width: `${interview > 0 ? (offer / interview) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-medium">Overall Success Rate</span>
                  <span className="text-gray-600">{offerRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                       style={{ width: `${offerRate}%` }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Applications per week</p>
                <p className="text-2xl font-bold text-gray-800">
                  {total > 0 ? Math.ceil(total / 4) : 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">{offerRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-6 rounded-2xl shadow-xl mx-6 text-white">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <div>
                <h3 className="font-bold text-lg">Keep Going!</h3>
                <p className="text-sm opacity-90">
                  You've sent {total} application{total !== 1 ? 's' : ''}. 
                  {offer > 0 ? ` Great job on getting ${offer} offer${offer !== 1 ? 's' : ''}!` : ' Your next offer is coming soon!'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {jobs.length === 0 && (
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center mx-6">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No applications yet</h3>
          <p className="text-gray-500">Start adding your job applications to see analytics and insights!</p>
        </div>
      )}

      {/* No Results State */}
      {jobs.length > 0 && total === 0 && (
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center mx-6">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No matching applications</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
