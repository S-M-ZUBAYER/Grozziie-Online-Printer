import React from "react";

const PaginationControls = ({ pagination }) => (
  <div className="flex justify-center space-x-1 dark:text-gray-100">
    <button
      onClick={pagination.goToPrevious}
      disabled={!pagination.canGoPrevious}
      className={`inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md bg-white dark:border-gray-800 ${
        pagination.canGoPrevious
          ? "border-black cursor-pointer"
          : "opacity-50 cursor-not-allowed"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        fill="[#0043681A]"
        className="w-4"
      >
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>

    {[
      pagination.currentPage,
      pagination.currentPage + 1,
      pagination.currentPage + 2,
    ].map((page) => (
      <button
        key={page}
        onClick={() => pagination.goToPage(page)}
        disabled={page > pagination.totalPages}
        className={`inline-flex items-center justify-center w-8 h-8 text-sm font-semibold border rounded shadow-md bg-white ${
          page === pagination.currentPage
            ? "text-[#004368]"
            : "text-[#004368] text-opacity-20"
        } ${
          page > pagination.totalPages
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        {page > pagination.totalPages ? ".." : page}
      </button>
    ))}

    <button
      onClick={pagination.goToNext}
      disabled={!pagination.canGoNext}
      className={`inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow-md bg-white dark:border-gray-200 ${
        pagination.canGoNext
          ? "border-black cursor-pointer"
          : "opacity-50 cursor-not-allowed"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        fill="[#0043681A]"
        className="w-4"
      >
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  </div>
);

export default PaginationControls;
