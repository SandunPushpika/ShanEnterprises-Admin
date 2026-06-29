import { Bell, Menu } from "lucide-react";

export default function HeaderComponent({ isOpen, setIsOpen }) {
    return (
        <header className="h-20 bg-white border-b border-border px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <button className="lg:hidden w-11 h-11 rounded-2xl border border-border bg-white flex items-center justify-center">
                    <Menu className="w-5 h-5 text-secondary" onClick={() => setIsOpen(!isOpen)} />
                </button>

                <div>
                    <h1 className="text-2xl font-bold font-display text-secondary">
                        Dashboard Overview
                    </h1>

                    <p className="text-sm text-muted">
                        Welcome back, here's what's happening today.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">

                {/* Profile */}
                <div className="flex items-center gap-3 bg-white border border-border rounded-2xl px-3 py-2 shadow-soft">
                    <img
                        src="https://i.pravatar.cc/100"
                        alt="Admin"
                        className="w-10 h-10 rounded-xl object-cover"
                    />

                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-secondary">
                            Admin User
                        </p>

                        <p className="text-xs text-muted">
                            Super Admin
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}