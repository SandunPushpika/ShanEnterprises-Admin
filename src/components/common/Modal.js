import React from "react";
import { X } from "lucide-react";

function Modal({ title, subtitle, onClose, children }) {
    const titleId = `modal-title-${Date.now()}`;
    
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div
                className="fixed inset-0 bg-secondary/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-glow overflow-hidden flex flex-col max-h-[90vh]"
            >

                <div className="px-6 py-5 border-b border-border flex items-center justify-between shrink-0">
                    <div>
                        <h3 id={titleId} className="text-xl font-bold text-secondary">{title}</h3>
                        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted hover:text-secondary hover:bg-slate-50 transition"
                        aria-label="Close modal"
                        title="Close modal"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default Modal;