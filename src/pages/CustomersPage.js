import React, { useState, useEffect, useCallback } from "react";
import CustomerStats from "../components/Customer/CustomerStats";
import CustomerTable from "../components/Customer/CustomerTable";
import CustomerViewModal from "../components/Customer/CustomerViewModal";
import SearchBar from "../components/common/Searchbar";
import { UserX, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { searchCustomers, updateCustomerStatus } from "../services/CustomerService";

const TABS = ["ALL", "ACTIVE", "INACTIVE"];
const TAB_LABELS = {
    ALL: "All Customers",
    ACTIVE: "Active",
    INACTIVE: "Inactive",
};
const PILL_ACTIVE = {
    ALL: "bg-secondary text-white border-secondary",
    ACTIVE: "bg-emerald-600 text-white border-emerald-600",
    INACTIVE: "bg-rose-600 text-white border-rose-600",
};

const PAGE_SIZE = 8;

function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await searchCustomers({
                status: statusFilter,
                searchTerm,
                pageNumber,
                pageSize: PAGE_SIZE,
            });

            setCustomers(result.data || []);
            setTotalCount(result.total || 0);
        } catch (err) {
            console.error("Failed to load customers:", err);
            setError(err.message || "Failed to load customers.");
            setCustomers([]);
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, searchTerm, pageNumber]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleStatusChange = (tab) => {
        setStatusFilter(tab);
        setPageNumber(1);
    };

    const handleSearchChange = (term) => {
        setSearchTerm(term);
        setPageNumber(1);
    };

    const handleActivate = async (id) => {
        try {
            await updateCustomerStatus(id, "ACTIVE");

            if (selectedCustomer && selectedCustomer.id === id) {
                setSelectedCustomer((prev) => ({ ...prev, status: "ACTIVE" }));
            }

            if (statusFilter === "INACTIVE" && customers.length === 1 && pageNumber > 1) {
                setPageNumber((p) => p - 1);
            } else {
                await fetchCustomers();
            }
        } catch (err) {
            alert("Failed to activate customer: " + (err.message || "Unknown error"));
        }
    };

    const handleDeactivate = async (id) => {
        try {
            await updateCustomerStatus(id, "INACTIVE");

            if (selectedCustomer && selectedCustomer.id === id) {
                setSelectedCustomer((prev) => ({ ...prev, status: "INACTIVE" }));
            }

            if (statusFilter === "ACTIVE" && customers.length === 1 && pageNumber > 1) {
                setPageNumber((p) => p - 1);
            } else {
                await fetchCustomers();
            }
        } catch (err) {
            alert("Failed to deactivate customer: " + (err.message || "Unknown error"));
        }
    };

    const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

    return (
        <div className="p-4 md:p-8 min-h-[calc(100vh-80px)] space-y-8 bg-surface">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary tracking-tight font-display">
                        Customers
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        Manage customer accounts and profiles ({totalCount} total registered)
                    </p>
                </div>
            </div>

            <CustomerStats customers={customers} />

            <div className="space-y-3">
                <SearchBar
                    searchQuery={searchTerm}
                    setSearchQuery={handleSearchChange}
                    placeholder="Search customers by name, email, or phone..."
                />

                <div className="flex flex-wrap gap-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleStatusChange(tab)}
                            className={`px-4 py-1.5 rounded-full border text-xs font-bold transition ${statusFilter === tab
                                ? PILL_ACTIVE[tab]
                                : "bg-white border-border text-secondary hover:bg-slate-50"
                                }`}
                        >
                            {TAB_LABELS[tab]}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-16 bg-card border border-border rounded-3xl shadow-card">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                    <p className="text-sm font-medium text-muted">Loading customers...</p>
                </div>
            ) : error ? (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-3xl text-center">
                    <p className="font-semibold">{error}</p>
                    <button
                        onClick={fetchCustomers}
                        className="mt-3 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            ) : customers.length > 0 ? (
                <>
                    <CustomerTable
                        customers={customers}
                        onView={setSelectedCustomer}
                        onActivate={handleActivate}
                        onDeactivate={handleDeactivate}
                    />

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-border pt-4 px-2">
                            <p className="text-xs text-muted font-medium">
                                Showing Page {pageNumber} of {totalPages} ({totalCount} customers)
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
                                    disabled={pageNumber === 1}
                                    className="p-2 rounded-xl border border-border bg-white text-secondary disabled:opacity-40 hover:bg-slate-50 transition"
                                    aria-label="Previous Page"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-xs font-bold px-3 text-secondary">
                                    {pageNumber} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPageNumber((p) => Math.min(p + 1, totalPages))}
                                    disabled={pageNumber === totalPages}
                                    className="p-2 rounded-xl border border-border bg-white text-secondary disabled:opacity-40 hover:bg-slate-50 transition"
                                    aria-label="Next Page"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-card max-w-xl mx-auto mt-6">
                    <UserX className="w-16 h-16 text-muted/50 mx-auto stroke-[1.5]" />
                    <h3 className="text-xl font-bold text-secondary mt-5">No Customers Found</h3>
                    <p className="text-muted text-sm mt-2">
                        No customers match &ldquo;{searchTerm}&rdquo; in the {TAB_LABELS[statusFilter]} tab.
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => handleSearchChange("")}
                            className="mt-6 px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}

            {selectedCustomer && (
                <CustomerViewModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                />
            )}
        </div>
    );
}

export default CustomersPage;
