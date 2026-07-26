import React, { useState, useEffect, useCallback } from "react";
import { Plus, CalendarX2, CheckCircle, AlertTriangle } from "lucide-react";
import Modal from "../components/common/Modal";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/Searchbar";
import ConfirmModal from "../components/common/ConfirmModal";
import BookingStatsBar from "../components/bookings/BookingStatsBar";
import BookingCard from "../components/bookings/BookingCard";
import BookingForm from "../components/bookings/BookingForm";
import BookingDetailModal from "../components/bookings/BookingDetailModal";
import AssignDriverModal from "../components/bookings/AssignDriverModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Pagination from "../components/common/Pagination";
import { getAllBookings, cancelBooking, completeBooking, assignDriverToBooking } from "../services/BookingService";

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


function mapBooking(b) {
    return {
        id: b.id,
        customer_name: b.customerName ?? "",
        vehicle_name: b.vehicleModel ?? "",
        driver_id: b.driverId ?? null,
        driver_name: b.driverName ?? "",
        booking_reference: b.bookingReference ?? "",
        pickup_location: b.pickupLocation ?? "",
        dropoff_location: b.dropoffLocation ?? "",
        pickup_datetime: b.pickupDateTime ?? "",
        return_datetime: b.returnDateTime ?? "",
        rental_days: b.rentalDays ?? null,
        estimated_distance_km: b.estimatedDistanceKm ?? "",
        with_driver: b.withDriver ?? false,
        base_rental_cost: b.baseRentalCost ?? "0.00",
        driver_fee: b.driverFee ?? "0.00",
        tax_amount: b.taxAmount ?? "0.00",
        discount_amount: b.discountAmount ?? "0.00",
        total_amount: b.totalAmount ?? "0.00",
        special_notes: b.specialNotes ?? "",
        booking_status: b.bookingStatus ?? "PENDING",
        cancelled_reason: b.cancelledReason ?? "",
        confirmed_at: b.confirmedAt ?? null,
        completed_at: b.completedAt ?? null,
        created_at: b.createdAt ?? null,
    };
}

export default function BookingPage() {
    const [bookings, setBookings] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(9);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [isCompleteOpen, setIsCompleteOpen] = useState(false);
    const [isAssignDriverOpen, setIsAssignDriverOpen] = useState(false);
    const [viewedBooking, setViewedBooking] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [formData, setFormData] = useState(BLANK_FORM);
    const [formErrors, setFormErrors] = useState({});
    const [toast, setToast] = useState(null);

    const openAssignDriver = (booking) => {
        setSelectedBooking(booking);
        setIsAssignDriverOpen(true);
    };

    const handleAssignDriverSave = async (bookingId, driverId) => {
        const result = await assignDriverToBooking(bookingId, driverId);
        if (result.success) {
            showToast(result.message, "success");
            setIsAssignDriverOpen(false);
            setSelectedBooking(null);
            loadBookings();
        } else {
            showToast(result.message, "error");
        }
    };

    const loadBookings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await getAllBookings({ pageNumber, pageSize });

            setBookings((result.data ?? []).map(mapBooking));
            setTotal(result.total ?? 0);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Failed to load bookings";
            setError(message);
            showToast(message, "error");
        } finally {
            setIsLoading(false);
        }
    }, [pageNumber, pageSize]);

    useEffect(() => {
        loadBookings();
    }, [loadBookings]);

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

    const openView = (booking) => { setViewedBooking(booking); setIsViewOpen(true); };

    const openAdd = () => { setFormData(BLANK_FORM); setFormErrors({}); setIsAddOpen(true); };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsAddOpen(false);
        showToast(`Booking ${formData.booking_reference} created!`);
        loadBookings();
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
        setIsEditOpen(false);
        showToast("Booking updated successfully!");
        loadBookings();
    };

    const openCancel = (booking) => {
        setSelectedBooking(booking);
        setIsCancelOpen(true);
    };

    const handleCancelConfirm = async () => {
        if (!selectedBooking) return;
        try {
            setIsLoading(true);
            await cancelBooking(selectedBooking.id);
            showToast(`Booking ${selectedBooking.booking_reference} cancelled successfully.`, "success");
            setIsCancelOpen(false);
            setSelectedBooking(null);
            loadBookings();
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to cancel booking";
            showToast(message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const openComplete = (booking) => {
        setSelectedBooking(booking);
        setIsCompleteOpen(true);
    };

    const handleCompleteConfirm = async () => {
        if (!selectedBooking) return;
        try {
            setIsLoading(true);
            await completeBooking(selectedBooking.id);
            showToast(`Booking ${selectedBooking.booking_reference} completed successfully.`, "success");
            setIsCompleteOpen(false);
            setSelectedBooking(null);
            loadBookings();
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to complete booking";
            showToast(message, "error");
        } finally {
            setIsLoading(false);
        }
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

            {isLoading ? (
                <LoadingSpinner />
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                        onClick={loadBookings}
                        className="mt-4 px-4 py-2 rounded-lg bg-primary text-white"
                    >
                        Retry
                    </button>
                </div>
            ) : filtered.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filtered.map((b) => (
                            <BookingCard
                                key={b.id}
                                booking={b}
                                onView={openView}
                                onCancel={openCancel}
                                onComplete={openComplete}
                                onAssignDriver={openAssignDriver}
                            />
                        ))}
                    </div>
                    <Pagination
                        currentPage={pageNumber}
                        totalPages={Math.ceil(total / pageSize)}
                        onPageChange={setPageNumber}
                        isLoading={isLoading}
                    />
                </>
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
                    onAssignDriver={openAssignDriver}
                />
            )}

            {isAssignDriverOpen && selectedBooking && (
                <AssignDriverModal
                    booking={selectedBooking}
                    onClose={() => {
                        setIsAssignDriverOpen(false);
                        setSelectedBooking(null);
                    }}
                    onSave={handleAssignDriverSave}
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
                    />
                </Modal>
            )}

            <ConfirmModal
                isOpen={isCompleteOpen}
                title="Complete Booking?"
                message={`Are you sure you want to mark booking "${selectedBooking?.booking_reference}" for ${selectedBooking?.customer_name} as COMPLETED?`}
                confirmLabel="Yes, Complete"
                cancelLabel="Cancel"
                onConfirm={handleCompleteConfirm}
                onCancel={() => {
                    setIsCompleteOpen(false);
                    setSelectedBooking(null);
                }}
                icon={CheckCircle}
                variant="success"
            />

            <ConfirmModal
                isOpen={isCancelOpen}
                title="Cancel Booking?"
                message={`Are you sure you want to cancel booking "${selectedBooking?.booking_reference}" for ${selectedBooking?.customer_name}? This action cannot be undone.`}
                confirmLabel="Yes, Cancel"
                cancelLabel="Keep Booking"
                onConfirm={handleCancelConfirm}
                onCancel={() => {
                    setIsCancelOpen(false);
                    setSelectedBooking(null);
                }}
                icon={AlertTriangle}
                variant="danger"
            />
        </div>
    );
}