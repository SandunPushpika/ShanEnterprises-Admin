import { useEffect, useState, useCallback } from "react";
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import BottomCard from "../components/common/BottomCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getDashboardStats } from "../services/DashboardService";
import { approveDriver, rejectDriver } from "../services/DriverService";
import {
  CarFront, CalendarCheck, ClipboardCheck, Users,
  CircleCheckBig, Clock3, XCircle, AlertCircle,
  Loader2, TrendingUp, RefreshCw, DollarSign,
} from "lucide-react";

// ─── colour tokens ─────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Pending:   "#f59e0b",
  Confirmed: "#3b82f6",
  Ongoing:   "#8b5cf6",
  Completed: "#10b981",
  Cancelled: "#ef4444",
};

const FLEET_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

// ─── custom tooltip ─────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, prefix = "", suffix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-2xl shadow-card px-4 py-3 text-sm">
      <p className="font-semibold text-secondary mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? p.fill }} className="font-medium">
          {p.name}: {prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}{suffix}
        </p>
      ))}
    </div>
  );
};

// ─── custom donut label ──────────────────────────────────────────────────────
const DonutLabel = ({ cx, cy, total }) => (
  <>
    <text x={cx} y={cy - 10} textAnchor="middle" className="fill-secondary" style={{ fontSize: 28, fontWeight: 700, fill: "#1e293b" }}>
      {total}
    </text>
    <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontSize: 12, fill: "#94a3b8" }}>
      Total Bookings
    </text>
  </>
);

// ─── section wrapper ─────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, children, className = "" }) => (
  <div className={`bg-card border border-border rounded-3xl shadow-card overflow-hidden ${className}`}>
    <div className="px-6 pt-6 pb-4 border-b border-border">
      <h2 className="text-lg font-semibold text-secondary">{title}</h2>
      {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ─── main component ──────────────────────────────────────────────────────────
export default function Main() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [driverActionLoading, setDriverActionLoading] = useState({});

  const loadStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const handleApproveDriver = async (driverId) => {
    setDriverActionLoading(p => ({ ...p, [driverId]: "approve" }));
    const result = await approveDriver(driverId);
    setDriverActionLoading(p => ({ ...p, [driverId]: false }));
    if (result.success) loadStats(true);
    else alert(result.message);
  };

  const handleRejectDriver = async (driverId) => {
    setDriverActionLoading(p => ({ ...p, [driverId]: "reject" }));
    const result = await rejectDriver(driverId);
    setDriverActionLoading(p => ({ ...p, [driverId]: false }));
    if (result.success) loadStats(true);
    else alert(result.message);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => loadStats()}
            className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // ── derived data ──────────────────────────────────────────────────────────

  // 1. Bookings over time (area chart) — fill gaps so the line is continuous
  const bookingsTimeline = (stats.bookingsOverTime ?? []).map(p => ({
    date: p.date?.slice(5) ?? p.date, // "MM-DD"
    Bookings: p.value,
  }));

  // 2. Revenue over time (bar chart)
  const revenueTimeline = (stats.revenueOverTime ?? []).map(p => {
    const [yr, mo] = (p.date ?? "").split("-");
    const label = yr && mo
      ? new Date(Number(yr), Number(mo) - 1).toLocaleString("en", { month: "short", year: "2-digit" })
      : p.date;
    return { month: label, Revenue: Number(p.value) };
  });

  // 3. Booking status donut
  const statusDonut = (stats.bookingsByStatus ?? []).filter(s => s.value > 0);
  const totalBookings = stats.totalBookings ?? 0;

  // 4. Fleet radial
  const fleetData = [
    { name: "Available",    value: stats.availableVehicles  ?? 0, fill: FLEET_COLORS[0] },
    { name: "Booked",       value: stats.bookedVehicles     ?? 0, fill: FLEET_COLORS[1] },
    { name: "Maintenance",  value: stats.maintenanceVehicles ?? 0, fill: FLEET_COLORS[2] },
    { name: "Unavailable",  value: stats.unavailableVehicles ?? 0, fill: FLEET_COLORS[3] },
  ].filter(d => d.value > 0);

  // top KPI cards
  const kpiCards = [
    {
      title: "Total Vehicles",
      value: stats.totalVehicles ?? 0,
      sub: `${stats.availableVehicles ?? 0} Available`,
      icon: CarFront,
      accent: "text-primary bg-primary-light",
    },
    {
      title: "Active Bookings",
      value: (stats.ongoingBookings ?? 0) + (stats.confirmedBookings ?? 0),
      sub: `${stats.pendingBookings ?? 0} Pending`,
      icon: CalendarCheck,
      accent: "text-blue-600 bg-blue-50",
    },
    {
      title: "Pending Drivers",
      value: stats.pendingDrivers ?? 0,
      sub: `${stats.approvedDrivers ?? 0} Approved`,
      icon: ClipboardCheck,
      accent: "text-amber-600 bg-amber-50",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers ?? 0,
      sub: "Registered users",
      icon: Users,
      accent: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Total Revenue",
      value: `Rs. ${(stats.totalRevenue ?? 0).toLocaleString("en", { minimumFractionDigits: 0 })}`,
      sub: `Rs. ${(stats.monthlyRevenue ?? 0).toLocaleString("en", { minimumFractionDigits: 0 })} this month`,
      icon: DollarSign,
      accent: "text-violet-600 bg-violet-50",
      wide: true,
    },
    {
      title: "This Month's Bookings",
      value: stats.bookingsOverTime?.reduce((s, p) => s + p.value, 0) ?? 0,
      sub: "Last 30 days",
      icon: TrendingUp,
      accent: "text-rose-600 bg-rose-50",
      wide: true,
    },
  ];

  return (
    <div className="p-4 md:p-8 min-h-[calc(100vh-80px)] space-y-8 bg-surface">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary tracking-tight font-display">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Real-time overview of your rental business</p>
        </div>
        <button
          onClick={() => loadStats(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-secondary hover:bg-slate-50 font-semibold text-sm transition disabled:opacity-60"
        >
          {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpiCards.filter(c => !c.wide).map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-card border border-border rounded-3xl p-6 shadow-card hover:shadow-soft transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted text-sm">{item.title}</p>
                  <h2 className="text-4xl font-bold mt-3 text-secondary">{item.value}</h2>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.accent}`}>
                  <Icon className="w-7 h-7" />
                </div>
              </div>
              <p className="mt-4 text-sm text-muted font-medium">{item.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Revenue + Growth wide cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {kpiCards.filter(c => c.wide).map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-card border border-border rounded-3xl p-6 shadow-card hover:shadow-soft transition-all flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center ${item.accent}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-muted text-sm">{item.title}</p>
                <h2 className="text-3xl font-bold mt-1 text-secondary">{item.value}</h2>
                <p className="text-xs text-muted mt-1">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Chart Row 1: Bookings Timeline + Status Donut ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Bookings over 30 days – Area Chart */}
        <ChartCard
          className="xl:col-span-2"
          title="Bookings — Last 30 Days"
          subtitle="Daily new booking volume"
        >
          {bookingsTimeline.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={bookingsTimeline} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip suffix=" bookings" />} />
                <Area type="monotone" dataKey="Bookings" stroke="#6366f1" strokeWidth={2.5} fill="url(#bookingGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No booking data for the last 30 days" />
          )}
        </ChartCard>

        {/* Booking status – Donut / Pie */}
        <ChartCard title="Booking Status" subtitle="Distribution by current status">
          {statusDonut.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusDonut}
                    cx="50%" cy="50%"
                    innerRadius={62} outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="label"
                  >
                    {statusDonut.map((entry, i) => (
                      <Cell key={i} fill={entry.color || STATUS_COLORS[entry.label] || "#6366f1"} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip suffix=" bookings" />} />
                  <DonutLabel cx={0} cy={0} total={totalBookings} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-2">
                {statusDonut.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-secondary font-medium">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color || STATUS_COLORS[s.label] }} />
                    {s.label} <span className="text-muted ml-auto">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyChartState message="No booking data yet" />
          )}
        </ChartCard>
      </div>

      {/* ── Chart Row 2: Monthly Revenue + Fleet Radial + Driver Requests ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Monthly Revenue – Bar Chart */}
        <ChartCard
          className="xl:col-span-2"
          title="Monthly Revenue"
          subtitle="Completed payment totals — last 6 months (LKR)"
        >
          {revenueTimeline.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueTimeline} margin={{ top: 4, right: 12, left: 0, bottom: 0 }} barSize={36}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#10b981" stopOpacity={1}   />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false}
                  tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                <Tooltip content={<ChartTooltip prefix="Rs. " />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="Revenue" fill="url(#revenueGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No revenue data yet for the last 6 months" />
          )}
        </ChartCard>

        {/* Right column: Fleet status + Driver Requests */}
        <div className="flex flex-col gap-6">

          {/* Fleet Status – Radial Bar */}
          <div className="bg-card border border-border rounded-3xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-secondary">Fleet Status</h2>
            <p className="text-xs text-muted mt-0.5 mb-4">Vehicle availability breakdown</p>
            {fleetData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <RadialBarChart
                    cx="50%" cy="100%"
                    innerRadius={30} outerRadius={120}
                    startAngle={180} endAngle={0}
                    data={fleetData}
                    barSize={14}
                  >
                    <RadialBar minAngle={5} dataKey="value" cornerRadius={6} />
                    <Tooltip content={<ChartTooltip suffix=" vehicles" />} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-1">
                  {fleetData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-secondary font-medium">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                      {d.name} <span className="text-muted ml-auto">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyChartState message="No fleet data" small />
            )}
          </div>

          {/* Pending Driver Requests */}
          <div className="bg-card border border-border rounded-3xl shadow-card overflow-hidden flex-1">
            <div className="p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-secondary">Driver Requests</h2>
              <p className="text-xs text-muted mt-0.5">Approve or reject pending applicants</p>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {stats.pendingDriverRequests?.length > 0 ? (
                stats.pendingDriverRequests.map((driver) => (
                  <div key={driver.id} className="border border-border rounded-2xl p-4 bg-surface">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-secondary text-sm">{driver.driverName}</h3>
                        <p className="text-xs text-muted mt-0.5">{driver.licenseNumber}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        PENDING
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleApproveDriver(driver.id)}
                        disabled={!!driverActionLoading[driver.id]}
                        className="flex-1 flex justify-center items-center h-9 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
                      >
                        {driverActionLoading[driver.id] === "approve"
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : "Approve"}
                      </button>
                      <button
                        onClick={() => handleRejectDriver(driver.id)}
                        disabled={!!driverActionLoading[driver.id]}
                        className="flex-1 flex justify-center items-center h-9 rounded-xl border border-danger/20 bg-danger/10 text-danger text-xs font-semibold hover:bg-danger/20 transition disabled:opacity-50"
                      >
                        {driverActionLoading[driver.id] === "reject"
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : "Reject"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted text-sm py-6">No pending driver requests.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BottomCard
          title="Completed Rentals"
          value={stats.completedBookings ?? 0}
          icon={CircleCheckBig}
          color="text-success"
          description="Successfully completed rentals"
        />
        <BottomCard
          title="Pending Bookings"
          value={stats.pendingBookings ?? 0}
          icon={Clock3}
          color="text-warning"
          description="Bookings awaiting confirmation"
        />
        <BottomCard
          title="Cancelled Orders"
          value={stats.cancelledBookings ?? 0}
          icon={XCircle}
          color="text-danger"
          description="Cancelled bookings"
        />
      </div>
    </div>
  );
}

// ─── empty state helper ──────────────────────────────────────────────────────
function EmptyChartState({ message, small = false }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center text-muted ${small ? "py-6" : "py-14"}`}>
      <TrendingUp className={`${small ? "w-8 h-8" : "w-12 h-12"} opacity-20 mb-2`} />
      <p className="text-sm">{message}</p>
    </div>
  );
}