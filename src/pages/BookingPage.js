import React, { useState, useEffect } from "react";
import { Plus, CalendarX2 } from "lucide-react";
import Modal from "../components/common/Modal";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/Searchbar";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import BookingStatsBar from "../components/bookings/BookingStatsBar";
import BookingCard from "../components/bookings/BookingCard";
import BookingForm from "../components/bookings/BookingForm";
import BookingDetailModal from "../components/bookings/BookingDetailModal";

const INITIAL_VEHICLES = [];
const loadVehicles = () => {
    try {
        const saved = localStorage.getItem("drivelux_vehicles_v2");
        return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
    } catch { return INITIAL_VEHICLES; }
};

const INITIAL_BOOKINGS = [
    {
        id: 1,
        customer_name: "Amal Perera",
        vehicle_name: "Tesla Model S",
        driver_name: "Suresh Bandara",
        booking_reference: "BK-20240001",
        pickup_location: "Colombo Fort, CMB",
        dropoff_location: "Bandaranaike International Airport",
        pickup_datetime: "2024-07-10T08:00",
        return_datetime: "2024-07-13T18:00",
        rental_days: 3,
        estimated_distance_km: "320.00",
        with_driver: true,
        base_rental_cost: "540.00",
        driver_fee: "90.00",
        tax_amount: "63.00",
        discount_amount: "20.00",
        total_amount: "673.00",
        special_notes: "Customer requires child seat.",
        booking_status: "CONFIRMED",
        cancelled_reason: "",
    },
    {
        id: 2,
        customer_name: "Nirosha Fernando",
        vehicle_name: "Range Rover Sport",
        driver_name: "",
        booking_reference: "BK-20240002",
        pickup_location: "Kandy City Centre",
        dropoff_location: "Nuwara Eliya",
        pickup_datetime: "2024-07-15T09:30",
        return_datetime: "2024-07-17T17:00",
        rental_days: 2,
        estimated_distance_km: "180.00",
        with_driver: false,
        base_rental_cost: "500.00",
        driver_fee: "0.00",
        tax_amount: "50.00",
        discount_amount: "0.00",
        total_amount: "550.00",
        special_notes: "",
        booking_status: "PENDING",
        cancelled_reason: "",
    },
    {
        id: 3,
        customer_name: "Dilan Jayawardena",
        vehicle_name: "Porsche 911 Carrera",
        driver_name: "Kamal Rathnayake",
        booking_reference: "BK-20240003",
        pickup_location: "Galle Dutch Fort",
        dropoff_location: "Colombo Fort, CMB",
        pickup_datetime: "2024-06-20T07:00",
        return_datetime: "2024-06-22T20:00",
        rental_days: 2,
        estimated_distance_km: "250.00",
        with_driver: true,
        base_rental_cost: "640.00",
        driver_fee: "80.00",
        tax_amount: "72.00",
        discount_amount: "50.00",
        total_amount: "742.00",
        special_notes: "VIP client — priority service.",
        booking_status: "COMPLETED",
        cancelled_reason: "",
    },
    {
        id: 4,
        customer_name: "Sanduni Wickramasinghe",
        vehicle_name: "Audi Q8",
        driver_name: "",
        booking_reference: "BK-20240004",
        pickup_location: "Negombo Beach",
        dropoff_location: "Colombo Hilton",
        pickup_datetime: "2024-08-01T10:00",
        return_datetime: "2024-08-03T10:00",
        rental_days: 2,
        estimated_distance_km: "90.00",
        with_driver: false,
        base_rental_cost: "420.00",
        driver_fee: "0.00",
        tax_amount: "42.00",
        discount_amount: "0.00",
        total_amount: "462.00",
        special_notes: "Delivery to hotel lobby.",
        booking_status: "CANCELLED",
        cancelled_reason: "Customer changed travel plans.",
    },
    {
        id: 5,
        customer_name: "Ruwan Kumara",
        vehicle_name: "BMW M4 Competition",
        driver_name: "Thilak Seneviratne",
        booking_reference: "BK-20240005",
        pickup_location: "Colombo 03",
        dropoff_location: "Hambantota",
        pickup_datetime: "2024-09-05T06:00",
        return_datetime: "2024-09-07T22:00",
        rental_days: 2,
        estimated_distance_km: "400.00",
        with_driver: true,
        base_rental_cost: "560.00",
        driver_fee: "100.00",
        tax_amount: "66.00",
        discount_amount: "30.00",
        total_amount: "696.00",
        special_notes: "",
        booking_status: "CONFIRMED",
        cancelled_reason: "",
    },
];

const BLANK_FORM = {
    customer_name: "",
    vehicle_name: "",
    driver_name: "",
    booking_reference: "",
    pickup_location: "",
    dropoff_location: "",
    pickup_datetime: "",
    return_datetime: "",
    rental_days: "",
    estimated_distance_km: "",
    with_driver: false,
    base_rental_cost: "",
    driver_fee: "0.00",
    tax_amount: "0.00",
    discount_amount: "0.00",
    total_amount: "",
    special_notes: "",
    booking_status: "PENDING",
    cancelled_reason: "",
};

/* ── Known drivers ───────────────────────────────────────────────── */
const DRIVERS = [
    "Suresh Bandara",
    "Kamal Rathnayake",
    "Thilak Seneviratne",
    "Nimal Jayasuriya",
    "Roshan Perera",
    "Asanka Kumara",
];

export default function BookingPage() {
    const [bookings, setBookings] = useState(() => {
        const saved = localStorage.getItem("shan_bookings_v1");
        if (!saved) return INITIAL_BOOKINGS;
        try { return JSON.parse(saved); }
        catch { localStorage.removeItem("shan_bookings_v1"); return INITIAL_BOOKINGS; }
    });

    const [vehicles] = useState(() => loadVehicles().filter((v) => v.status === "Available"));

    useEffect(() => {
        try { localStorage.setItem("shan_bookings_v1", JSON.stringify(bookings)); }
        catch (err) { console.warn("Failed to persist bookings:", err); }
    }, [bookings]);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [viewedBooking, setViewedBooking] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [formData, setFormData] = useState(BLANK_FORM);
    const [formErrors, setFormErrors] = useState({});
    const [toast, setToast] = useState(null);

    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.booking_status === "CONFIRMED").length;
    const completed = bookings.filter((b) => b.booking_status === "COMPLETED").length;
    const pending = bookings.filter((b) => b.booking_status === "PENDING").length;
    const cancelled = bookings.filter((b) => b.booking_status === "CANCELLED").length;

    const filtered = bookings.filter((b) => {
        const q = searchQuery.toLowerCase().trim();
        const matchQuery = !q || [
            b.booking_reference, b.customer_name, b.vehicle_name,
            b.driver_name, b.pickup_location, b.dropoff_location, b.booking_status,
        ].some((v) => v?.toLowerCase().includes(q));

        const matchStatus = statusFilter === "ALL" || b.booking_status === statusFilter;
        return matchQuery && matchStatus;
    });

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const validate = () => {
        const e = {};
        if (!formData.booking_reference.trim()) e.booking_reference = "Booking reference is required";
        if (!formData.customer_name.trim()) e.customer_name = "Customer name is required";
        if (!formData.vehicle_name.trim()) e.vehicle_name = "Vehicle is required";
        if (!formData.pickup_location.trim()) e.pickup_location = "Pickup location is required";
        if (!formData.pickup_datetime) e.pickup_datetime = "Pickup date & time is required";
        if (!formData.return_datetime) e.return_datetime = "Return date & time is required";
        if (formData.return_datetime && formData.pickup_datetime &&
            new Date(formData.return_datetime) <= new Date(formData.pickup_datetime))
            e.return_datetime = "Return must be after pickup";
        if (!formData.base_rental_cost || Number(formData.base_rental_cost) < 0)
            e.base_rental_cost = "Enter a valid base rental cost";
        if (!formData.total_amount || Number(formData.total_amount) < 0)
            e.total_amount = "Enter a valid total amount";
        setFormErrors(e);
        return Object.keys(e).length === 0;
    };

    const openView = (booking) => {
        setViewedBooking(booking);
        setIsViewOpen(true);
    };

    const openAdd = () => {
        setFormData(BLANK_FORM);
        setFormErrors({});
        setIsAddOpen(true);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setBookings((prev) => [{ ...formData, id: Date.now() }, ...prev]);
        setIsAddOpen(false);
        showToast(`Booking ${formData.booking_reference} created!`);
    };

    const openEdit = (booking) => {
        setSelectedBooking(booking);
        setFormData({ ...booking });
        setFormErrors({});
        setIsEditOpen(true);
    };

    const handleEdit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setBookings((prev) =>
            prev.map((b) => (b.id === selectedBooking.id ? { ...b, ...formData } : b))
        );
        setIsEditOpen(false);
        showToast("Booking updated successfully!");
    };

    const openDelete = (booking) => {
        setSelectedBooking(booking);
        setIsDeleteOpen(true);
    };

    const handleDelete = () => {
        setBookings((prev) => prev.filter((b) => b.id !== selectedBooking.id));
        setIsDeleteOpen(false);
        showToast(`Booking ${selectedBooking.booking_reference} removed.`, "error");
        setSelectedBooking(null);
    };

    const STATUS_PILLS = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    const PILL_ACTIVE = {
        ALL: "bg-secondary text-white border-secondary",
        PENDING: "bg-amber-500  text-white border-amber-500",
        CONFIRMED: "bg-emerald-600 text-white border-emerald-600",
        COMPLETED: "bg-blue-600   text-white border-blue-600",
        CANCELLED: "bg-rose-600   text-white border-rose-600",
    };

    return (
        <div className="p-4 md:p-8 min-h-[calc(100vh-80px)] space-y-8 bg-surface">
            {toast && <Toast type={toast.type} message={toast.message} />}

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary tracking-tight font-display">
                        Bookings
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        Create, track, and manage all rental bookings from one place.
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-cta-gradient text-white font-semibold shadow-glow hover:opacity-95 active:scale-[0.98] transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Booking
                </button>
            </div>

            <BookingStatsBar
                total={total}
                confirmed={confirmed}
                completed={completed}
                pending={pending}
                cancelled={cancelled}
            />

            <div className="space-y-3">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="Search by reference, customer, vehicle, location, status…"
                />

                <div className="flex flex-wrap gap-2">
                    {STATUS_PILLS.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-1.5 rounded-full border text-xs font-bold transition ${statusFilter === s
                                    ? PILL_ACTIVE[s]
                                    : "bg-white border-border text-secondary hover:bg-slate-50"
                                }`}
                        >
                            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((b) => (
                        <BookingCard
                            key={b.id}
                            booking={b}
                            onView={openView}
                            onEdit={openEdit}
                            onDelete={openDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-card max-w-xl mx-auto">
                    <CalendarX2 className="w-16 h-16 text-muted/50 mx-auto stroke-[1.5]" />
                    <h3 className="text-xl font-bold text-secondary mt-5">No Bookings Found</h3>
                    <p className="text-muted text-sm mt-2">
                        {searchQuery
                            ? `No bookings match "${searchQuery}". Try a different keyword.`
                            : "No bookings match the selected filter."}
                    </p>
                    <button
                        onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); }}
                        className="mt-6 px-5 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {isViewOpen && (
                <BookingDetailModal
                    booking={viewedBooking}
                    onClose={() => setIsViewOpen(false)}
                    onEdit={openEdit}
                />
            )}

            {isAddOpen && (
                <Modal
                    title="New Booking"
                    subtitle="Fill in the details to create a new rental booking."
                    onClose={() => setIsAddOpen(false)}
                >
                    <BookingForm
                        formData={formData}
                        setFormData={setFormData}
                        formErrors={formErrors}
                        onSubmit={handleAdd}
                        onCancel={() => setIsAddOpen(false)}
                        submitLabel="Create Booking"
                        isEdit={false}
                        drivers={DRIVERS}
                        vehicles={vehicles}
                    />
                </Modal>
            )}

            {isEditOpen && (
                <Modal
                    title="Edit Booking"
                    subtitle={`Updating record for "${selectedBooking?.booking_reference}"`}
                    onClose={() => setIsEditOpen(false)}
                >
                    <BookingForm
                        formData={formData}
                        setFormData={setFormData}
                        formErrors={formErrors}
                        onSubmit={handleEdit}
                        onCancel={() => setIsEditOpen(false)}
                        submitLabel="Save Changes"
                        isEdit={true}
                        drivers={DRIVERS}
                        vehicles={vehicles}
                    />
                </Modal>
            )}

            {isDeleteOpen && (
                <DeleteConfirmModal
                    vehicle={{ model: selectedBooking?.booking_reference, registrationNumber: selectedBooking?.customer_name, brandId: "Booking" }}
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteOpen(false)}
                />
            )}
        </div>
    );
}