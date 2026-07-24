import React, { useEffect, useMemo, useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { getMaintenanceStats, searchMaintenanceRecords } from "../../services/MaintenanceService";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function MaintenanceChart({ vehicles }) {
    const [groupBy, setGroupBy] = useState("month"); // "month" or "vehicle"
    const [hoveredBar, setHoveredBar] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];
    }, []);

    const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setIsLoading(true);
                if (groupBy === "month") {
                    const stats = await getMaintenanceStats("month", Number(selectedYear));
                    const monthlyMap = Array(12).fill(0).map((_, i) => ({
                        label: MONTH_NAMES[i],
                        value: 0
                    }));
                    stats.forEach(item => {
                        const parts = item.label.split(" ");
                        const monthName = parts[0]; // "Jan"
                        const idx = MONTH_NAMES.indexOf(monthName);
                        if (idx !== -1) {
                            monthlyMap[idx].value = Number(item.totalCost) || 0;
                        }
                    });
                    setChartData(monthlyMap);
                } else if (groupBy === "vehicle") {
                    const result = await searchMaintenanceRecords({
                        year: Number(selectedYear),
                        pageNumber: 1,
                        pageSize: 100
                    });
                    const vehicleMap = {};
                    (result.data || []).forEach((r) => {
                        const vId = r.vehicleId;
                        const vehicle = vehicles.find((v) => v.id === Number(vId) || v.id === String(vId));
                        const label = vehicle
                            ? `${vehicle.brand?.name || ""} ${vehicle.model} (${vehicle.registrationNumber})`
                            : `Vehicle #${vId}`;
                        
                        vehicleMap[label] = (vehicleMap[label] || 0) + (Number(r.cost) || 0);
                    });
                    const data = Object.entries(vehicleMap).map(([label, value]) => ({
                        label,
                        value,
                    }));
                    setChartData(data);
                }
            } catch (err) {
                console.error("Failed to load chart data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChartData();
    }, [selectedYear, groupBy, vehicles]);

    const maxValue = Math.max(...chartData.map((d) => d.value), 0);
    const displayMaxValue = maxValue > 0 ? maxValue * 1.15 : 10000; // Leave 15% head room

    // SVG Chart Dimensions
    const paddingLeft = 70;
    const paddingRight = 30;
    const paddingTop = 35;
    const paddingBottom = 35;
    const height = 280;
    const width = 820;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    return (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-card hover:shadow-soft transition-all duration-300 max-w-5xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-secondary tracking-tight">
                            Maintenance Expenses Chart
                        </h3>
                        <p className="text-muted text-xs mt-0.5">
                            Monthly overview for the selected year
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex bg-surface border border-border rounded-xl p-1 gap-1">
                        <button
                            onClick={() => setGroupBy("month")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                groupBy === "month"
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-muted hover:text-secondary"
                            }`}
                        >
                            Group by Month
                        </button>
                        <button
                            onClick={() => setGroupBy("vehicle")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                groupBy === "vehicle"
                                    ? "bg-white text-primary shadow-sm"
                                    : "text-muted hover:text-secondary"
                            }`}
                        >
                            Group by Vehicle
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2">
                        <span className="text-xs font-semibold text-muted uppercase tracking-wider">Year</span>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="bg-transparent text-sm font-semibold text-secondary outline-none cursor-pointer"
                        >
                            {availableYears.length > 0 ? (
                                availableYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))
                            ) : (
                                <option value={selectedYear}>{selectedYear}</option>
                            )}
                        </select>
                    </div>
                </div>
            </div>

            {chartData.length === 0 || maxValue === 0 ? (
                <div className="h-[180px] flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-surface/50 text-center p-6">
                    <TrendingUp className="w-10 h-10 text-muted/40 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-secondary mt-3">No expenses recorded for {selectedYear}</p>
                    <p className="text-xs text-muted mt-1">Expenses will be plotted here once maintenance logs for this year are added.</p>
                </div>
            ) : (
                <div className="relative">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3B82F6" />
                                <stop offset="100%" stopColor="#2563EB" />
                            </linearGradient>
                            <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#60A5FA" />
                                <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                        </defs>

                        {/* Y-Axis Grid Lines & Labels */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                            const val = displayMaxValue * ratio;
                            const y = paddingTop + chartHeight * (1 - ratio);
                            return (
                                <g key={index}>
                                    <line
                                        x1={paddingLeft}
                                        y1={y}
                                        x2={width - paddingRight}
                                        y2={y}
                                        stroke="#E2E8F0"
                                        strokeDasharray="4 4"
                                    />
                                    <text
                                        x={paddingLeft - 10}
                                        y={y + 4}
                                        className="text-[10px] font-bold text-muted fill-current"
                                        textAnchor="end"
                                    >
                                        {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Bars & Labels */}
                        {chartData.map((d, index) => {
                            const barCount = chartData.length;
                            const totalBarWidth = chartWidth / barCount;
                            const gap = totalBarWidth * 0.25; // 25% gap
                            const barWidth = totalBarWidth - gap;

                            const x = paddingLeft + index * totalBarWidth + gap / 2;
                            const barHeight = maxValue > 0 ? (d.value / displayMaxValue) * chartHeight : 0;
                            const y = paddingTop + chartHeight - barHeight;

                            const isHovered = hoveredBar === index;

                            // Label text styling
                            const isVehicleMode = groupBy === "vehicle";
                            const truncatedLabel = isVehicleMode && d.label.length > 12 
                                ? `${d.label.slice(0, 10)}...`
                                : d.label;

                            return (
                                <g key={index}>
                                    {/* Bar element */}
                                    <rect
                                        x={x}
                                        y={y}
                                        width={barWidth}
                                        height={barHeight}
                                        fill={isHovered ? "url(#barGradientHover)" : "url(#barGradient)"}
                                        rx={Math.min(4, barWidth / 3)}
                                        className="cursor-pointer transition-all duration-300"
                                        onMouseEnter={() => setHoveredBar(index)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                    />

                                    {/* Tooltip value on top (if hovered) */}
                                    {isHovered && d.value > 0 && (() => {
                                        const tooltipW = 110;
                                        const tooltipH = 26;
                                        const tooltipX = Math.max(5, Math.min(x + barWidth / 2 - tooltipW / 2, width - tooltipW - 5));
                                        const tooltipY = Math.max(2, y - tooltipH - 8);
                                        return (
                                            <g>
                                                <rect
                                                    x={tooltipX}
                                                    y={tooltipY}
                                                    width={tooltipW}
                                                    height={tooltipH}
                                                    fill="#0F172A"
                                                    rx="6"
                                                />
                                                {/* Arrow */}
                                                <polygon
                                                    points={`${x + barWidth / 2 - 5},${tooltipY + tooltipH} ${x + barWidth / 2 + 5},${tooltipY + tooltipH} ${x + barWidth / 2},${tooltipY + tooltipH + 5}`}
                                                    fill="#0F172A"
                                                />
                                                <text
                                                    x={tooltipX + tooltipW / 2}
                                                    y={tooltipY + tooltipH / 2 + 1}
                                                    fill="#FFFFFF"
                                                    fontSize="11"
                                                    fontWeight="700"
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    LKR {d.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                </text>
                                            </g>
                                        );
                                    })()}

                                    {/* X-Axis labels */}
                                    <text
                                        x={x + barWidth / 2}
                                        y={height - paddingBottom + 16}
                                        className="text-[9px] font-bold text-muted fill-current"
                                        textAnchor="middle"
                                        transform={isVehicleMode ? `rotate(-15, ${x + barWidth / 2}, ${height - paddingBottom + 16})` : ""}
                                    >
                                        {truncatedLabel}
                                        {isVehicleMode && d.label.length > 12 && (
                                            <title>{d.label}</title>
                                        )}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Baseline */}
                        <line
                            x1={paddingLeft}
                            y1={paddingTop + chartHeight}
                            x2={width - paddingRight}
                            y2={paddingTop + chartHeight}
                            stroke="#94A3B8"
                            strokeWidth="1.5"
                        />
                    </svg>

                    {/* Chart Legend/Indicator */}
                    <div className="flex justify-end gap-5 text-xs font-semibold text-muted mt-2 px-6">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded bg-primary"></span>
                            <span>Expenses (LKR)</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
