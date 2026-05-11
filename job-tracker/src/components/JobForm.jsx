import { useState } from "react";

const JobForm = ({ addJob }) => {

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newJob = {
      id: Date.now(),
      company,
      position,
      status,
      deadline,
    };

    addJob(newJob);

    setCompany("");
    setPosition("");
    setStatus("Applied");
    setDeadline("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 m-6 p-6 rounded-2xl shadow-lg"
    >

      <div className="grid md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="p-3 rounded-lg bg-slate-700 outline-none"
          required
        />

        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="p-3 rounded-lg bg-slate-700 outline-none"
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-3 rounded-lg bg-slate-700"
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
        </select>

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="p-3 rounded-lg bg-slate-700"
        />

      </div>

      <button className="bg-cyan-500 mt-5 px-6 py-3 rounded-lg hover:bg-cyan-600 transition">
        Add Job
      </button>

    </form>
  );
};

export default JobForm;