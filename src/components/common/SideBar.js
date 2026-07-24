import {
    LayoutDashboard,
    CarFront,
    CalendarCheck,
    Users,
    ClipboardCheck,
    LogOut,
    X,
    Wrench
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: CarFront, label: "Vehicles", path: "/vehicles" },
    { icon: CalendarCheck, label: "Bookings", path: "/bookings" },
    { icon: ClipboardCheck, label: "Drivers", path: "/drivers" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: Wrench, label: "Maintenance", path: "/vehicle-maintenance" },
];

export default function SideBar({ isOpen, setIsOpen, onLogoutClick }) {

    return (
        <>
            {/* Overlay (mobile only) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:sticky top-0 left-0 z-50
                    h-screen w-72 bg-sidebar border-r border-border
                    transform transition-transform duration-300
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                    flex flex-col
                `}
            >
                {/* Header */}
                <div className="h-20 px-6 flex items-center justify-between border-b border-border">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-2xl bg-cta-gradient flex items-center justify-center shadow-glow">
                            <CarFront className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <h1 className="font-display text-xl font-semibold text-secondary"> DriveLux </h1>
                            <p className="text-sm text-muted"> Admin Dashboard </p>
                        </div>
                    </div>

                    {/* Close button (mobile only) */}
                    <button
                        className="lg:hidden"
                        onClick={() => setIsOpen(false)}
                    >
                        <X />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-xl transition
                                ${isActive
                                    ? "bg-primary text-white"
                                    : "text-black hover:bg-muted/10"
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-border">
                    <button
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-500 hover:bg-red-500/10 transition"
                        onClick={onLogoutClick}
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}