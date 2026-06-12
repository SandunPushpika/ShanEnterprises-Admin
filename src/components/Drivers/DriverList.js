import React from "react";
import DriverCard from "./DriverCard";

function DriverList({ drivers }) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {drivers.map((driver) => (
                <DriverCard
                    key={driver.id}
                    driver={driver}
                />
            ))}
        </div>
    );
}

export default DriverList;
