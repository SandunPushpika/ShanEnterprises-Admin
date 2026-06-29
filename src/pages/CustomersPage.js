import React, { useState } from "react";
import CustomerStats from "../components/Customer/CustomerStats";
import CustomerSearch from "../components/Customer/CustomerSearch";
import CustomerList from "../components/Customer/CustomerList";
import CustomerViewModal from "../components/Customer/CustomerViewModal";

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
        <div className="p-8 min-h-screen bg-surface">

            <div className="mb-6">
                <h1 className="text-4xl font-bold text-secondary">
                    Customers
                </h1>
                <p className="text-muted mt-2">
                    Manage customer accounts and profiles
                </p>
            </div>

            <CustomerStats customers={customers} />

            <CustomerSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            <CustomerList
                customers={filteredCustomers}
                onView={setSelectedCustomer}
            />

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