import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Car, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { getDriverTrips } from "../services/DriverService";
import Pagination from "../components/common/Pagination";
import Toast from "../components/common/Toast";
import { getVehicleStatusLabel } from "../utils/VehicleEnums";

const STATUS_BADGES = {
    CONFIRMED: "bg-success/10 text-success",
    ONGOING: "bg-primary-light text-primary",
    COMPLETED: "bg-emerald-50 text-emerald-700",
    CANCELLED: "bg-danger/10 text-danger",
    PENDING: "bg-warning/10 text-warning"
};

export default function DriverTripsAdminPage() {
    const { driverId } = useParams();
    const navigate = useNavigate();
    
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadTrips();
    }, [driverId, pageNumber]);

    const loadTrips = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getDriverTrips(driverId, pageNumber, pageSize);
            setTrips(data.data || []);
            setTotal(data.total || 0);
        } catch (err) {
            setError(err.message || "Failed to load driver trips");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 min-h-[calc(100vh-80px)] space-y-6 bg-surface">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/drivers")}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-border text-secondary hover:bg-slate-50 transition"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary tracking-tight font-display">
                        Driver Trip History
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        View past and upcoming trips for this driver
                    </p>
                </div>
            </div>

            {/* Content */}
            {loading && trips.length === 0 ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-xl mx-auto mt-6">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                        onClick={loadTrips}
                        className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition font-semibold"
                    >
                        Retry
                    </button>
                </div>
            ) : trips.length > 0 ? (
                <div className="bg-card border border-border rounded-3xl shadow-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="bg-surface border-b border-border">
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted">Booking Ref</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted">Customer</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted">Vehicle</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted">Pickup Date</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted">Return Date</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted">Driver Fee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trips.map((trip) => (
                                    <tr key={trip.id} className="border-b border-border hover:bg-surface transition">
                                        <td className="px-6 py-5 font-semibold text-secondary">
                                            #{trip.bookingReference}
                                        </td>
                                        <td className="px-6 py-5 text-secondary">{trip.customerName}</td>
                                        <td className="px-6 py-5 text-secondary">{trip.vehicleModel}</td>
                                        <td className="px-6 py-5 text-secondary">
                                            {new Date(trip.pickupDateTime).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5 text-secondary">
                                            {new Date(trip.returnDateTime).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${STATUS_BADGES[trip.bookingStatus] || "bg-surface text-muted"}`}>
                                                {trip.bookingStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 font-bold text-secondary">
                                            LKR {trip.driverFee?.toFixed(2) || "0.00"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-border">
                        <Pagination
                            currentPage={pageNumber}
                            totalPages={Math.ceil(total / pageSize)}
                            onPageChange={setPageNumber}
                            isLoading={loading}
                        />
                    </div>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-card max-w-xl mx-auto mt-6">
                    <Car className="w-16 h-16 text-muted/50 mx-auto stroke-[1.5]" />
                    <h3 className="text-xl font-bold text-secondary mt-5">No Trips Found</h3>
                    <p className="text-muted text-sm mt-2">
                        This driver has not taken any trips yet.
                    </p>
                </div>
            )}
        </div>
    );
}
