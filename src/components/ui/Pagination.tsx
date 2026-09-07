"use client";

import React, { useRef } from "react";

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
  targetRef?: React.RefObject<HTMLElement | null>;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize = 35,
  onPageChange,
  className = "",
  targetRef,
}: PaginationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePageChange = (newPage: number) => {
    if (newPage === currentPage) return;
    onPageChange(newPage);

    setTimeout(() => {
      const targetElement =
        targetRef?.current ||
        containerRef.current?.closest("[data-table-container]") ||
        containerRef.current?.closest(".overflow-hidden") ||
        containerRef.current?.closest(".overflow-x-auto") ||
        containerRef.current?.parentElement;

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  // Generate page numbers with smart ellipses
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-xs text-gray-500 dark:text-zinc-400 ${className}`}
    >
      <div>
        Showing <span className="font-semibold text-gray-900 dark:text-zinc-100">{startItem}</span> to{" "}
        <span className="font-semibold text-gray-900 dark:text-zinc-100">{endItem}</span> of{" "}
        <span className="font-semibold text-gray-900 dark:text-zinc-100">{totalItems}</span> entries (35 per page)
      </div>

      <div className="flex items-center gap-1.5">
        {/* Previous button */}
        <button
          type="button"
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors font-medium cursor-pointer"
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400 dark:text-zinc-600">
                  …
                </span>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => handlePageChange(page)}
                aria-current={isCurrent ? "page" : undefined}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm"
                    : "border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none transition-colors font-medium cursor-pointer"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
