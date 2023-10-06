"use client";

interface PaginationProps {
  totalPages: number; // the total number of pages
  currentPage: number; // the current page number
  onChange: (page: number) => void; // the callback function when a page is clicked
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onChange,
}) => {
  // a helper function to generate an array of page numbers
  const getPages = () => {
    const pages = [];
    if (totalPages <= 8) {
      // if there are less than or equal to 8 pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // if there are more than 8 pages, show the first 6, then ..., then the last page
      for (let i = 1; i <= 6; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav className="flex items-center justify-center space-x-2">
      {/* render the previous button */}
      <button
        className="inline-flex items-center gap-2 rounded-md p-4 text-gray-500 hover:text-blue-600"
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        <span aria-hidden="true">«</span>
      </button>
      {/* render the page numbers */}
      {getPages().map((page, index) => (
        <button
          key={index}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full p-2 text-sm font-medium ${
            page === "..." ? "cursor-default" : ""
          } ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "text-gray-500 hover:text-blue-600"
          }`}
          disabled={page === "..."}
          onClick={() => onChange(page as number)}
        >
          {page}
        </button>
      ))}
      {/* render the next button */}
      <button
        className="inline-flex items-center gap-2 rounded-md p-4 text-gray-500 hover:text-blue-600"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        <span aria-hidden="true">»</span>
      </button>
    </nav>
  );
};

export default Pagination;
