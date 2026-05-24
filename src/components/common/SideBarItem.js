export default function SidebarItem({ icon: Icon, label, active = false }) {
  return (
    <button
      className={`w-full flex items-center gap-4 px-4 h-14 rounded-2xl transition-all font-medium ${
        active
          ? "bg-primary text-white shadow-soft"
          : "text-secondary hover:bg-sidebarHover"
      }`}
    >
      <Icon className="w-5 h-5" />

      <span>{label}</span>
    </button>
  );
}