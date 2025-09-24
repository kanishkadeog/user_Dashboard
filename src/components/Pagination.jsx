import React from "react";

export default function Pagination({
  total,
  pageLimit,
  currentPage,
  setCurrentPage,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageLimit));
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  if (totalPages === 1) return null;

  return (
    <nav className="mt-3">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
            Prev
          </button>
        </li>
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(p)}>
              {p}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
