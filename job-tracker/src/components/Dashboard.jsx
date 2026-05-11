const Dashboard = ({ jobs }) => {

  const applied = jobs.filter(job => job.status === "Applied").length;
  const interview = jobs.filter(job => job.status === "Interview").length;
  const offer = jobs.filter(job => job.status === "Offer").length;

  return (
    <div className="grid md:grid-cols-3 gap-6 p-6">

      <div className="bg-blue-500 p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold">Applied</h2>
        <p className="text-4xl mt-4">{applied}</p>
      </div>

      <div className="bg-yellow-500 p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold">Interview</h2>
        <p className="text-4xl mt-4">{interview}</p>
      </div>

      <div className="bg-green-500 p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold">Offer</h2>
        <p className="text-4xl mt-4">{offer}</p>
      </div>

    </div>
  );
};

export default Dashboard;