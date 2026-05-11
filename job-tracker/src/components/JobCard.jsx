import { motion } from "framer-motion";

const JobCard = ({ job, deleteJob }) => {

  return (

    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-slate-800 p-6 rounded-2xl shadow-xl"
    >

      <h2 className="text-2xl font-bold text-cyan-400">
        {job.company}
      </h2>

      <p className="mt-2 text-lg">
        {job.position}
      </p>

      <p className="mt-2">
        Status:
        <span className="ml-2 font-bold">
          {job.status}
        </span>
      </p>

      <p className="mt-2">
        Deadline:
        <span className="ml-2">
          {job.deadline}
        </span>
      </p>

      <button
        onClick={() => deleteJob(job.id)}
        className="bg-red-500 mt-4 px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Delete
      </button>

    </motion.div>
  );
};

export default JobCard;