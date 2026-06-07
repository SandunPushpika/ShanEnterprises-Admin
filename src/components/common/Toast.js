import React from "react";
import { CheckCircle2 } from "lucide-react";

function Toast({ type = "success", message }) {
    return (
        <div
            className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-glow text-white font-medium animate-fade-in ${
                type === "success" ? "bg-emerald-600" : "bg-rose-600"
            }`}
            role="alert"
            aria-live="polite"
        >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{message}</span>
        </div>
    );
}

export default Toast;
