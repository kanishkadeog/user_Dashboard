import React from "react";

// Pagination component to navigate through pages
// Props:
// - total: total number of items
// - pageLimit: number of items per page
// - currentPage: currently active page
// - setCurrentPage: callback to update current page
export default function Pagination({
  total,
  pageLimit,
  currentPage,
  setCurrentPage,
}) {
  // Calculate total number of pages
  const totalPages = Math.max(1, Math.ceil(total / pageLimit));
  
  // Generate array of page numbers [1, 2, ..., totalPages]
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  // Hide pagination if only 1 page
  if (totalPages === 1) return null;

  return (
    <nav className="mt-3">
      <ul className="pagination justify-content-center">
        {/* Previous button */}
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>
        </li>

        {/* Page number buttons */}
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(p)}>
              {p}
            </button>
          </li>
        ))}

        {/* Next button */}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
