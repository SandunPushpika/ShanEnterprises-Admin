import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false,
}) {
    if (totalPages <= 1) {
        return null;
    }

    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
            pages.push("...");
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pages.push("...");
        }
        pages.push(totalPages);
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mt-8">
            <p className="text-sm text-muted">
                Page <span className="font-semibold text-secondary">{currentPage}</span> of{" "}
                <span className="font-semibold text-secondary">{totalPages}</span>
            </p>

            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-border text-secondary hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                    {pages.map((page, idx) => (
                        <button
                            key={idx}
                            onClick={() => typeof page === "number" && onPageChange(page)}
                            disabled={page === "..." || currentPage === page || isLoading}
                            className={`h-10 w-10 rounded-xl font-semibold transition ${
                                currentPage === page
                                    ? "bg-primary text-white shadow-glow"
                                    : page === "..."
                                        ? "cursor-default text-muted"
                                        : "border border-border text-secondary hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            }`}
                            aria-label={typeof page === "number" ? `Page ${page}` : undefined}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-border text-secondary hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
