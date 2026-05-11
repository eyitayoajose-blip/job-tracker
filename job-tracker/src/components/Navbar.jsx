const Navbar = () => {
  return (
    <nav className="bg-slate-800 shadow-lg p-5 flex justify-between items-center">

      <h1 className="text-3xl font-bold text-cyan-400">
        Job Tracker
      </h1>

      <button className="bg-cyan-500 px-4 py-2 rounded-lg hover:bg-cyan-600 transition">
        Track Success
      </button>

    </nav>
  );
};

export default Navbar;