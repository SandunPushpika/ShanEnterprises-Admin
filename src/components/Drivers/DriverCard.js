import React from "react";

function DriverCard({ driver }) {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                        {driver.name}
                    </h3>

                    <p className="text-gray-500">
                        {driver.license}
                    </p>

                    <p className="mt-2 text-gray-600">
                        {driver.phone}
                    </p>
                </div>

                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${driver.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                        }`}
                >
                    {driver.status}
                </span>
            </div>

            <div className="flex gap-3 mt-5">
                <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
                    Approve
                </button>

                <button className="border border-red-400 text-red-500 font-bold-200 px-5 py-2 rounded-lg transition duration-200 hover:bg-red-200 hover:text-red">
                    Reject
                </button>
            </div>

        </div>
    );
}

export default DriverCard;