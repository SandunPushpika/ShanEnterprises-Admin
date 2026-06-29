import React from "react";
import { Eye } from "lucide-react";

function CustomerCard({ customer, onView }) {

    const statusColor = {
        ACTIVE: "bg-green-100 text-green-700",
        INACTIVE: "bg-gray-200 text-gray-700",
        SUSPENDED: "bg-red-100 text-red-700",
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">

            <div className="flex items-center gap-3">
                <img
                    src={`https://ui-avatars.com/api/?name=${customer.firstName}+${customer.lastName}`}
                    className="w-12 h-12 rounded-full"
                />

                <div>
                    <div className="font-bold">
                        {customer.firstName} {customer.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                        {customer.email}
                    </div>
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <div>{customer.phoneNumber}</div>
                <div>{customer.city}</div>
            </div>

            <div className="mt-3 flex justify-between items-center">

                <span className={`px-2 py-1 rounded text-xs ${statusColor[customer.status]}`}>
                    {customer.status}
                </span>

                <button
                    onClick={() => onView(customer)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded"
                >
                    <Eye size={16} />
                    View
                </button>

            </div>

        </div>
    );
}

export default CustomerCard;