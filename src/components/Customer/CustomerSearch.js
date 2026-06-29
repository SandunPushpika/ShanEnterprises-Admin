import React from "react";
import { Search } from "lucide-react";

function CustomerSearch({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter
}) {
    return (
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4">

            <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" />
                <input
                    className="w-full pl-10 p-2 border rounded"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <select
                className="border p-2 rounded"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option value="ALL">All</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                
            </select>

        </div>
    );
}

export default CustomerSearch;