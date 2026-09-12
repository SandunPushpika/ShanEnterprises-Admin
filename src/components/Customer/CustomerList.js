import React from "react";
import CustomerTable from "./CustomerTable";

function CustomerList({ customers, onView, onActivate, onDeactivate }) {
    return (
        <CustomerTable
            customers={customers}
            onView={onView}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
        />
    );
}

export default CustomerList;