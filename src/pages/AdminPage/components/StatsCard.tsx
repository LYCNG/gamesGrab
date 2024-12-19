


interface StatsCardProps {
  title: string;
  value: number;
  percentage: string;
  icon: React.ElementType;
  color: string;
}

const StatsCard = ({ title, value, percentage, icon: Icon, color }: StatsCardProps) => (
  <div className={`p-6 rounded-xl ${color}`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      <span className="text-green-500 text-sm">{percentage}</span>
      <div className="ml-2 h-1 w-20 bg-gray-200 rounded">
        <div className="h-1 bg-blue-500 rounded" style={{ width: '70%' }}></div>
      </div>
    </div>
  </div>
);

export default StatsCard;
