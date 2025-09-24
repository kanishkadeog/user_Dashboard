import React from "react";

// Pagination component to navigate through user pages
const Pagination = ({ total, limit, currentPage, setCurrentPage }) => {
  // Calculate total number of pages
  const totalPages = Math.ceil(total / limit);

  // Create an array of page numbers [1, 2, ..., totalPages]
  const pages = [...Array(totalPages).keys()].map((i) => i + 1);

  return (
    <nav>
      <ul className="pagination">
        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${currentPage === page ? "active" : ""}`} // Highlight active page
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(page)} // Update current page on click
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
