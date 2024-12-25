interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center space-x-2 text-purple-400 mb-2">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}