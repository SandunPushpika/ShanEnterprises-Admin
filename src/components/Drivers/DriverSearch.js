import React from "react";

function DriverSearch() {
    return (
        <div className="mb-8">
            <input
                type="text"
                placeholder="Search drivers..."
                className="w-1/2 border-2 border-blue-500 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}

export default DriverSearch;