import React from "react";
import {
    FaUserTie,
    FaHourglassHalf,
    FaUserCheck,
    FaUserTimes,
} from "react-icons/fa";

function DriverStats() {
    const stats = [
        {
            title: "Total Drivers",
            value: 24,
            icon: <FaUserTie size={24} />,
            bg: "bg-blue-100",
            color: "text-blue-600",
        },
        {
            title: "Pending Approval",
            value: 8,
            icon: <FaHourglassHalf size={24} />,
            bg: "bg-yellow-100",
            color: "text-yellow-600",
        },
        {
            title: "Approved",
            value: 14,
            icon: <FaUserCheck size={24} />,
            bg: "bg-green-100",
            color: "text-green-600",
        },
        {
            title: "Rejected",
            value: 2,
            icon: <FaUserTimes size={24} />,
            bg: "bg-red-100",
            color: "text-red-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((item, index) => (
                <div
                    key={index}
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">
                                {item.title}
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {item.value}
                            </h2>
                        </div>

                        <div
                            className={`${item.bg} ${item.color} p-3 rounded-xl`}
                        >
                            {item.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DriverStats;
