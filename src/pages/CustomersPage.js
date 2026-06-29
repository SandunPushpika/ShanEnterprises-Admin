import React, { useState } from "react";
import CustomerStats from "../components/Customer/CustomerStats";
import CustomerList from "../components/Customer/CustomerList";
import CustomerViewModal from "../components/Customer/CustomerViewModal";
import SearchBar from "../components/common/Searchbar";
import { UserX } from "lucide-react";

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

function CustomersPage() {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const customers = [
        {
            id: 1,
            firstName: "John",
            lastName: "Smith",
            email: "john@gmail.com",
            phoneNumber: "+94 71 123 4567",
            city: "Colombo",
            address: "Main Street Colombo",
            nicPassportNumber: "200145678901",
            status: "ACTIVE",
            emailVerified: true,
            profileImageUrl: null,
            createdAt: "2026-01-12",
            updatedAt: "2026-05-20",
        },
        {
            id: 2,
            firstName: "Emma",
            lastName: "Johnson",
            email: "emma@gmail.com",
            phoneNumber: "+94 77 987 6543",
            city: "Kandy",
            address: "Lake Road",
            nicPassportNumber: "199945612345",
            status: "ACTIVE",
            emailVerified: true,
            profileImageUrl: null,
            createdAt: "2026-02-08",
            updatedAt: "2026-04-15",
        },
        {
            id: 3,
            firstName: "Michael",
            lastName: "Brown",
            email: "michael@gmail.com",
            phoneNumber: "+94 76 555 1122",
            city: "Galle",
            address: "Temple Street",
            nicPassportNumber: "199812345678",
            status: "INACTIVE",
            emailVerified: false,
            profileImageUrl: null,
            createdAt: "2026-03-01",
            updatedAt: "2026-05-10",
        },
        {
            id: 4,
            firstName: "Sarah",
            lastName: "Wilson",
            email: "sarah@gmail.com",
            phoneNumber: "+94 70 555 6677",
            city: "Matara",
            address: "Flower Road",
            nicPassportNumber: "200267890123",
            status: "ACTIVE",
            emailVerified: true,
            profileImageUrl: null,
            createdAt: "2026-03-18",
            updatedAt: "2026-05-25",
        },
    ];

    // Filtering
    const filteredCustomers = customers.filter((c) => {
        const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();

        const matchesSearch =
            fullName.includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phoneNumber.includes(searchTerm);

        const matchesStatus =
            statusFilter === "ALL" || c.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-4 md:p-8 min-h-[calc(100vh-80px)] space-y-8 bg-surface">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary tracking-tight font-display">
                        Customers
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        Manage customer accounts and profiles
                    </p>
                </div>
            </div>

            {/* Dynamic Statistics Cards */}
            <CustomerStats customers={customers} />

            {/* Search and Filters */}
            <div className="space-y-3">
                <SearchBar
                    searchQuery={searchTerm}
                    setSearchQuery={setSearchTerm}
                    placeholder="Search customers by name, email, or phone..."
                />

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
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

            {/* Customer List or Empty State */}
            {filteredCustomers.length > 0 ? (
                <CustomerList
                    customers={filteredCustomers}
                    onView={setSelectedCustomer}
                />
            ) : (
                <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-card max-w-xl mx-auto mt-6">
                    <UserX className="w-16 h-16 text-muted/50 mx-auto stroke-[1.5]" />
                    <h3 className="text-xl font-bold text-secondary mt-5">No Customers Found</h3>
                    <p className="text-muted text-sm mt-2">
                        No customers match &ldquo;{searchTerm}&rdquo; in the {TAB_LABELS[statusFilter]} tab.
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
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