const CategoryPagination = ({ currentPage, setCurrentPage, totalPages }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        className="btn-outline px-3 py-1 rounded"
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 rounded ${
            currentPage === i + 1 ? "bg-primary text-white" : "btn-outline"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        className="btn-outline px-3 py-1 rounded"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default CategoryPagination;