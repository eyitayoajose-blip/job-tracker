function FilterBar({ filter, setFilter }) {
  const filters = [
    "All",
    "Applied",
    "Interview",
    "Offer",
  ];

  return (
    <div className="filters">
      {filters.map((item) => (
        <button
          key={item}
          className={filter === item ? "active" : ""}
          onClick={() => setFilter(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;