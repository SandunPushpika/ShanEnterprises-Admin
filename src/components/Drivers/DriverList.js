import React from "react";
import DriverCard from "./DriverCard";

function DriverList({ drivers, onApprove, onReject, onView, actionLoading = {} }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {drivers.map((driver) => (
                <DriverCard
                    key={driver.id}
                    driver={driver}
                    onApprove={onApprove}
                    onReject={onReject}
                    onView={onView}
                    actionLoading={actionLoading}
                />
            ))}
        </div>
    );
}

export default DriverList;
