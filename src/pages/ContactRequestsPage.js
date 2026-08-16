import React, { useState, useEffect } from "react";
import { MessageSquare, Mail, User, Clock, CheckCircle, XCircle, Loader2, AlertCircle, Search, Filter, RefreshCw, X } from "lucide-react";
import { getAllContactRequests, updateContactStatus } from "../services/ContactService";
import Pagination from "../components/common/Pagination";
import Toast from "../components/common/Toast";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Modal from "../components/common/Modal";

const STATUS_TABS = ["ALL", "NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const STATUS_STYLES = {
    NEW: "bg-blue-50 text-blue-600 border-blue-200",
    IN_PROGRESS: "bg-amber-50 text-amber-600 border-amber-200",
    RESOLVED: "bg-emerald-50 text-emerald-600 border-emerald-200",
    CLOSED: "bg-slate-100 text-slate-600 border-slate-200"
};

export default function ContactRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    
    const [activeTab, setActiveTab] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [toast, setToast] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState("NEW");
    const [adminNotes, setAdminNotes] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadRequests();
    }, [pageNumber, activeTab, searchQuery]);

    const loadRequests = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            setError(null);
            
            const data = await getAllContactRequests({
                status: activeTab === "ALL" ? null : activeTab,
                search: searchQuery || null,
                pageNumber,
                pageSize
            });
            
            setRequests(data.data || []);
            setTotal(data.total || 0);
        } catch (err) {
            setError(err.message || "Failed to load contact requests");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const openModal = (request) => {
        setSelectedRequest(request);
        setStatusUpdate(request.status);
        setAdminNotes(request.adminNotes || "");
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await updateContactStatus(selectedRequest.id, statusUpdate, adminNotes);
            if (res.success) {
                showToast("Request updated successfully");
                setSelectedRequest(null);
                loadRequests();
            } else {
                showToast(res.message, "error");
            }
        } catch (err) {
            showToast("Failed to update", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 md:p-8 min-h-[calc(100vh-80px)] space-y-8 bg-surface">
            {toast && <Toast type={toast.type} message={toast.message} />}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary tracking-tight font-display">
                        Contact Requests
                    </h1>
                    <p className="text-muted text-sm mt-1">
                        Manage customer inquiries and support tickets
                    </p>
                </div>
                <button
                    onClick={() => loadRequests(true)}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-secondary hover:bg-slate-50 font-semibold text-sm transition disabled:opacity-60"
                >
                    {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Refresh
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                        type="text"
                        placeholder="Search by name, email, subject..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPageNumber(1);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition text-sm"
                    />
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setPageNumber(1); }}
                            className={`px-4 py-1.5 rounded-full border text-xs font-bold transition ${
                                activeTab === tab
                                    ? "bg-secondary text-white border-secondary"
                                    : "bg-white border-border text-secondary hover:bg-slate-50"
                            }`}
                        >
                            {tab.replace("_", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-24"><LoadingSpinner /></div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-12 text-center shadow-card max-w-xl mx-auto mt-6">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto stroke-[1.5]" />
                    <p className="text-red-600 font-medium mt-4">{error}</p>
                    <button onClick={() => loadRequests()} className="mt-5 px-5 py-2.5 rounded-xl border border-border bg-white text-secondary hover:bg-slate-50 font-semibold transition">
                        Try Again
                    </button>
                </div>
            ) : requests.length > 0 ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {requests.map(req => (
                            <div 
                                key={req.id} 
                                onClick={() => openModal(req)}
                                className="bg-card border border-border rounded-3xl p-6 shadow-card hover:shadow-soft transition cursor-pointer flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${STATUS_STYLES[req.status] || STATUS_STYLES.NEW}`}>
                                            {req.status.replace("_", " ")}
                                        </span>
                                        <span className="text-xs text-muted font-medium flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-secondary mb-1 truncate">{req.subject}</h3>
                                    <p className="text-sm text-muted line-clamp-2">{req.message}</p>
                                </div>
                                <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                        {req.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-secondary truncate">{req.name}</p>
                                        <p className="text-xs text-muted truncate">{req.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination
                        currentPage={pageNumber}
                        totalPages={Math.ceil(total / pageSize)}
                        onPageChange={setPageNumber}
                        isLoading={loading}
                    />
                </div>
            ) : (
                <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-card max-w-xl mx-auto mt-6">
                    <MessageSquare className="w-16 h-16 text-muted/50 mx-auto stroke-[1.5]" />
                    <h3 className="text-xl font-bold text-secondary mt-5">No Requests Found</h3>
                    <p className="text-muted text-sm mt-2">No contact requests match your criteria.</p>
                </div>
            )}

            {selectedRequest && (
                <Modal
                    title="Contact Request Details"
                    subtitle={`From ${selectedRequest.name} (${selectedRequest.email})`}
                    onClose={() => setSelectedRequest(null)}
                >
                    <div className="p-6 pt-0 space-y-6">
                        <div className="bg-surface rounded-2xl p-4 border border-border">
                            <h4 className="font-bold text-secondary text-sm mb-1">Subject</h4>
                            <p className="text-secondary">{selectedRequest.subject}</p>
                        </div>
                        <div className="bg-surface rounded-2xl p-4 border border-border">
                            <h4 className="font-bold text-secondary text-sm mb-1">Message</h4>
                            <p className="text-secondary whitespace-pre-wrap">{selectedRequest.message}</p>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t border-border">
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-2">Status</label>
                                <select
                                    value={statusUpdate}
                                    onChange={(e) => setStatusUpdate(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="NEW">New</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-secondary mb-2">Admin Notes</label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={3}
                                    placeholder="Add internal notes here..."
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="flex-1 py-2.5 rounded-xl border border-border text-secondary hover:bg-slate-50 font-semibold transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
