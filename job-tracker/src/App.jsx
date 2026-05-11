import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import JobForm from "./components/JobForm";
import JobCard from "./components/JobCard";
import Dashboard from "./components/Dashboard";

function App() {

  const [jobs, setJobs] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("jobs"));

    if(savedJobs){
      setJobs(savedJobs);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  // Add Job
  const addJob = (job) => {
    setJobs([...jobs, job]);
  };

  // Delete Job
  const deleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      <Navbar />

      <Dashboard jobs={jobs} />

      <JobForm addJob={addJob} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">

        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            deleteJob={deleteJob}
          />
        ))}

      </div>

    </div>
  );
}

export default App;