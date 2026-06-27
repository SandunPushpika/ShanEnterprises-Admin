import React from "react";
import DriverStats from "../components/Drivers/DriverStats";
import DriverSearch from "../components/Drivers/DriverSearch";
import DriverList from "../components/Drivers/DriverList";

function DriversPage() {
    const drivers = [
        {
            id: 1,
            name: "John Smith",
            license: "DL-238291",
            status: "Pending",
        },
        {
            id: 2,
            name: "Emma Johnson",
            license: "DL-883920",
            status: "Approved",
        },
        {
            id: 3,
            name: "Michael Brown",
            license: "DL-553221",
            status: "Rejected",
        },
        {
            id: 4,
            name: "Sarah Wilson",
            license: "DL-771120",
            status: "Pending",
        },
        {
            id: 5,
            name: "David Miller",
            license: "DL-882144",
            status: "Approved",
        },
    ];

    return (
        <div className="p-8 bg-surface min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-secondary">
                    Drivers
                </h1>

                <p className="text-muted mt-2">
                    Manage and monitor registered drivers
                </p>
            </div>

            {/* Statistics Cards */}
            <DriverStats />

            {/* Search & Filters */}
            <DriverSearch />

            {/* Driver Table */}
            <DriverList drivers={drivers} />
        </div>
    );
}

export default DriversPage;