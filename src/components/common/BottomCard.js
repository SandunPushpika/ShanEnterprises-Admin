export default function BottomCard({
  title,
  value,
  icon: Icon,
  color,
  description,
}) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3 text-secondary">
            {value}
          </h2>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center">
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
      </div>

      <p className="text-sm text-muted mt-5">
        {description}
      </p>
    </div>
  );
}