import React from "react";
import { LogOut } from "lucide-react";
import { createPortal } from "react-dom";

function LogoutConfirmModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-secondary/40 backdrop-blur-sm"
                onClick={onCancel}
            />
            {/* Modal Box */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-glow p-8 text-center mx-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-500 animate-float">
                    <LogOut className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-secondary mt-5">Confirm Log Out</h3>
                
                <p className="text-sm text-muted mt-2 leading-relaxed">
                    Are you sure you want to log out of the admin panel? You will need to log back in to manage inventory, drivers, and bookings.
                </p>
                
                <div className="mt-8 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-12 rounded-2xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md transition"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default LogoutConfirmModal;
