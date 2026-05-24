import BottomCard from "../components/common/BottomCard";

import {
  LayoutDashboard,
  CarFront,
  CalendarCheck,
  Users,
  ClipboardCheck,
  Bell,
  Search,
  Menu,
  ChevronRight,
  TrendingUp,
  CircleCheckBig,
  Clock3,
  XCircle,
} from "lucide-react";

const stats = [
  {
    title: "Total Vehicles",
    value: "128",
    growth: "+12%",
    icon: CarFront,
  },
  {
    title: "Active Bookings",
    value: "42",
    growth: "+8%",
    icon: CalendarCheck,
  },
  {
    title: "Pending Drivers",
    value: "18",
    growth: "+5%",
    icon: ClipboardCheck,
  },
  {
    title: "Total Customers",
    value: "1,248",
    growth: "+21%",
    icon: Users,
  },
];

const recentBookings = [
  {
    id: "#BK-1021",
    customer: "John Doe",
    vehicle: "BMW X5",
    status: "Active",
    amount: "$220",
  },
  {
    id: "#BK-1022",
    customer: "Sarah Smith",
    vehicle: "Tesla Model 3",
    status: "Pending",
    amount: "$180",
  },
  {
    id: "#BK-1023",
    customer: "Michael Lee",
    vehicle: "Toyota Prado",
    status: "Completed",
    amount: "$320",
  },
  {
    id: "#BK-1024",
    customer: "David Brown",
    vehicle: "Audi Q7",
    status: "Cancelled",
    amount: "$120",
  },
];

const driverRequests = [
  {
    name: "James Wilson",
    license: "DL-238291",
    status: "Pending Verification",
  },
  {
    name: "Emma Johnson",
    license: "DL-883920",
    status: "Documents Uploaded",
  },
  {
    name: "Chris Evans",
    license: "DL-192833",
    status: "Awaiting Approval",
  },
];

const getStatusStyles = (status) => {
  switch (status) {
    case "Active":
      return "bg-success/10 text-success";
    case "Pending":
      return "bg-warning/10 text-warning";
    case "Completed":
      return "bg-primary-light text-primary";
    case "Cancelled":
      return "bg-danger/10 text-danger";
    default:
      return "bg-surface text-muted";
  }
};

export default function Main() {
  return (
    <div className="p-4 md:p-8 min-h-[calc(100vh-80px)] space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-card border border-border rounded-3xl p-6 shadow-card hover:shadow-soft transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted text-sm">
                    {item.title}
                  </p>

                  <h2 className="text-4xl font-bold mt-3 text-secondary">
                    {item.value}
                  </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
              </div>

              <div className="mt-5 flex items-center text-success text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-2" />
                {item.growth} this month
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bookings Table */}
        <div className="xl:col-span-2 bg-card border border-border rounded-3xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-secondary">
                Recent Bookings
              </h2>

              <p className="text-sm text-muted mt-1">
                Latest vehicle rental bookings
              </p>
            </div>

            <button className="text-primary text-sm font-medium flex items-center hover:opacity-80">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted">
                    Booking ID
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted">
                    Customer
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted">
                    Vehicle
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map((booking, index) => (
                  <tr
                    key={index}
                    className="border-b border-border hover:bg-surface transition"
                  >
                    <td className="px-6 py-5 font-semibold text-secondary">
                      {booking.id}
                    </td>

                    <td className="px-6 py-5 text-secondary">
                      {booking.customer}
                    </td>

                    <td className="px-6 py-5 text-secondary">
                      {booking.vehicle}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 font-bold text-secondary">
                      {booking.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Driver Requests */}
        <div className="bg-card border border-border rounded-3xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-secondary">
              Driver Requests
            </h2>

            <p className="text-sm text-muted mt-1">
              Approve or reject incoming requests
            </p>
          </div>

          <div className="p-5 space-y-4">
            {driverRequests.map((driver, index) => (
              <div
                key={index}
                className="border border-border rounded-2xl p-4 bg-surface"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-secondary">
                      {driver.name}
                    </h3>

                    <p className="text-sm text-muted mt-1">
                      {driver.license}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Clock3 className="w-5 h-5 text-warning" />
                  </div>
                </div>

                <p className="text-sm text-muted mt-4">
                  {driver.status}
                </p>

                <div className="mt-5 flex gap-3">
                  <button className="flex-1 h-11 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition">
                    Approve
                  </button>

                  <button className="flex-1 h-11 rounded-xl border border-danger/20 bg-danger/10 text-danger font-medium hover:bg-danger/20 transition">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BottomCard
          title="Completed Rentals"
          value="312"
          icon={CircleCheckBig}
          color="text-success"
          description="Successfully completed rentals this month"
        />

        <BottomCard
          title="Pending Requests"
          value="26"
          icon={Clock3}
          color="text-warning"
          description="Bookings awaiting confirmation"
        />

        <BottomCard
          title="Cancelled Orders"
          value="9"
          icon={XCircle}
          color="text-danger"
          description="Cancelled bookings this month"
        />
      </div>
    </div>
  );
}