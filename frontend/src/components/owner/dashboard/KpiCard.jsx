const KpiCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-3xl border border-gray-100 bg-white p-6">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{label}</p>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
        <Icon size={18} className="text-red-600" />
      </div>
    </div>

    <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
      {value}
    </p>
  </div>
);

export default KpiCard;
