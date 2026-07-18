import React from "react";
import CustomerCard from "./CustomerCard";

function CustomerList({ customers, onView, onActivate, onDeactivate }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {customers.map((customer) => (
                <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onView={onView}
                    onActivate={onActivate}
                    onDeactivate={onDeactivate}
                />
            ))}
        </div>
    );
}

export default CustomerList;