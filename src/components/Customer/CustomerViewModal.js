import React from "react";
import { X } from "lucide-react";

function CustomerViewModal({ customer, onClose }) {

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[600px] p-6 rounded-xl relative">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3"
                >
                    <X />
                </button>

                <div className="flex items-center gap-4 mb-5">

                    <img
                        src={`https://ui-avatars.com/api/?name=${customer.firstName}+${customer.lastName}`}
                        className="w-16 h-16 rounded-full"
                    />

                    <div>
                        <h2 className="text-xl font-bold">
                            {customer.firstName} {customer.lastName}
                        </h2>
                        <p className="text-gray-500">{customer.email}</p>
                    </div>

                </div>

                <div className="space-y-2 text-sm">

                    <p><b>Phone:</b> {customer.phoneNumber}</p>
                    <p><b>City:</b> {customer.city}</p>
                    <p><b>Address:</b> {customer.address}</p>
                    <p><b>NIC:</b> {customer.nicPassportNumber}</p>
                    <p><b>Status:</b> {customer.status}</p>
                    <p><b>Email Verified:</b> {customer.emailVerified ? "Yes" : "No"}</p>
                    <p><b>Created:</b> {customer.createdAt}</p>

                </div>

            </div>

        </div>
    );
}

export default CustomerViewModal;