import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ searchQuery, setSearchQuery, placeholder }) {
    return (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                <input
                    type="text"
                    placeholder={placeholder ?? "Search…"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-surface text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
            </div>
        </div>
    );
}

