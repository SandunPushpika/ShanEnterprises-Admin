import React, { useState } from "react";
import DriverStats from "../components/Drivers/DriverStats";
import DriverList from "../components/Drivers/DriverList";
import DriverDetailModal from "../components/Drivers/DriverDetailModal";
import SearchBar from "../components/common/Searchbar";
import { UserX } from "lucide-react";

const INITIAL_DRIVERS = [
    {
        id: 1,
        name: "John Smith",
        license: "DL-238291",
        phone: "+1 (555) 234-5678",
        email: "john.smith@example.com",
        status: "Pending",
    },
    {
        id: 2,
        name: "Emma Johnson",
        license: "DL-883920",
        phone: "+1 (555) 876-5432",
        email: "emma.j@example.com",
        status: "Approved",
    },
    {
        id: 3,
        name: "Michael Brown",
        license: "DL-553221",
        phone: "+1 (555) 345-6789",
        email: "m.brown@example.com",
        status: "Rejected",
    },
    {
        id: 4,
        name: "Sarah Wilson",
        license: "DL-771120",
        phone: "+1 (555) 987-6543",
        email: "sarah.w@example.com",
        status: "Pending",
    },
    {
        id: 5,
        name: "David Miller",
        license: "DL-882144",
        phone: "+1 (555) 456-7890",
        email: "david.m@example.com",
        status: "Approved",
    },
];

const TABS = ["ALL", "APPROVED", "PENDING", "BLOCKED"];
const TAB_LABELS = {
    ALL: "All Drivers",
    APPROVED: "Approved",
    PENDING: "Pending",
    BLOCKED: "Blocked",
};

const PILL_ACTIVE = {
    ALL: "bg-secondary   text-white border-secondary",
    APPROVED: "bg-emerald-600 text-white border-emerald-600",
    PENDING: "bg-amber-500   text-white border-amber-500",
    BLOCKED: "bg-rose-600    text-white border-rose-600",
};

function DriversPage() {
    const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("ALL");
    const [viewedDriver, setViewedDriver] = useState(null);

    // Dynamic stats calculations
    const total = drivers.length;
    const pendingCount = drivers.filter((d) => d.status === "Pending").length;
    const approvedCount = drivers.filter((d) => d.status === "Approved").length;
    const blockedCount = drivers.filter((d) => d.status === "Blocked" || d.status === "Rejected").length;

    // Handlers to modify driver status
    const handleApprove = (id) => {
        setDrivers((prev) =>
            prev.map((d) => (d.id === id ? { ...d, status: "Approved" } : d))
        );
    };

    const handleReject = (id) => {
        setDrivers((prev) =>
            prev.map((d) => (d.id === id ? { ...d, status: "Blocked" } : d))
        );
    };

    const handleView = (driver) => {
        setViewedDriver(driver);
    };

    // Filtering logic
    const filteredDrivers = drivers.filter((driver) => {
        // Tab filtering
        let matchesTab = false;
        if (activeTab === "ALL") {
            matchesTab = true;
        } else if (activeTab === "APPROVED") {
            matchesTab = driver.status === "Approved";
        } else if (activeTab === "PENDING") {
            matchesTab = driver.status === "Pending";
        } else if (activeTab === "BLOCKED") {
            matchesTab = driver.status === "Blocked" || driver.status === "Rejected";
        }

        // Search filtering
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
            !q ||
            [driver.name, driver.license, driver.phone, driver.email].some((field) =>
                field?.toLowerCase().includes(q)
            );

        return matchesTab && matchesSearch;
    });

    return (
        <div className="p-4 md:p-8 min-h-[calc(100vh-80px)] space-y-8 bg-surface">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary tracking-tight font-display">
                        Drivers
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        Manage, verify, and monitor registered drivers
                    </p>
                </div>
            </div>

            {/* Dynamic Statistics Cards */}
            <DriverStats
                total={total}
                pending={pendingCount}
                approved={approvedCount}
                blocked={blockedCount}
            />

            {/* Search and Filters */}
            <div className="space-y-3">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="Search by name, license plate, phone or email..."
                />

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-full border text-xs font-bold transition ${activeTab === tab
                                ? PILL_ACTIVE[tab]
                                : "bg-white border-border text-secondary hover:bg-slate-50"
                                }`}
                        >
                            {TAB_LABELS[tab]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Drivers List or Empty State */}
            {filteredDrivers.length > 0 ? (
                <DriverList
                    drivers={filteredDrivers}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onView={handleView}
                />
            ) : (
                <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-card max-w-xl mx-auto mt-6">
                    <UserX className="w-16 h-16 text-muted/50 mx-auto stroke-[1.5]" />
                    <h3 className="text-xl font-bold text-secondary mt-5">No Drivers Found</h3>
                    <p className="text-muted text-sm mt-2">
                        No drivers match &ldquo;{searchQuery}&rdquo; in the {TAB_LABELS[activeTab]} tab.
                    </p>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-6 px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}

            {/* Driver Detail Modal */}
            {viewedDriver && (
                <DriverDetailModal
                    driver={viewedDriver}
                    onClose={() => setViewedDriver(null)}
                />
            )}
        </div>
    );
}

export default DriversPage;