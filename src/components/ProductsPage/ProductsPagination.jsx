import React from "react";

const ProductsPagination = ({
  currentPage = 1,
  totalPages = 1,
  setCurrentPage,
}) => {
  if (totalPages <= 1) return null;

  // Logic to generate page numbers with ellipses (...)
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    // Outer container with dark background to match your screenshot
    // Remove "bg-[#09090b] p-6 rounded-2xl" if placing inside an already dark container
    <div className="w-full bg-[#09090b] p-6 rounded-2xl flex justify-center items-center gap-3 mt-8 select-none">
      
      {/* --- Previous Button --- */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="group flex items-center justify-center w-11 h-11 rounded-xl bg-[#18181b] border border-[#27272a] text-gray-400 hover:border-purple-500/50 hover:text-purple-400 disabled:opacity-30 disabled:hover:border-[#27272a] disabled:hover:text-gray-400 transition-all duration-300 active:scale-95"
        aria-label="Previous Page"
      >
        <svg
          className="w-5 h-5 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* --- Page Numbers --- */}
      <div className="flex gap-2 bg-[#18181b] p-1.5 rounded-xl border border-[#27272a]">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="flex items-center justify-center w-9 h-9 text-gray-600 font-medium"
              >
                ...
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`relative w-9 h-9 text-sm font-semibold rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.35)] scale-100"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* --- Next Button --- */}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="group flex items-center justify-center w-11 h-11 rounded-xl bg-[#18181b] border border-[#27272a] text-gray-400 hover:border-purple-500/50 hover:text-purple-400 disabled:opacity-30 disabled:hover:border-[#27272a] disabled:hover:text-gray-400 transition-all duration-300 active:scale-95"
        aria-label="Next Page"
      >
        <svg
          className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default ProductsPagination;