export default function StatsCard({ title, value, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      light: 'from-blue-50 to-blue-100',
    },
    green: {
      bg: 'from-green-500 to-green-600',
      text: 'text-green-600',
      light: 'from-green-50 to-green-100',
    },
    red: {
      bg: 'from-red-500 to-red-600',
      text: 'text-red-600',
      light: 'from-red-50 to-red-100',
    },
    yellow: {
      bg: 'from-yellow-500 to-yellow-600',
      text: 'text-yellow-600',
      light: 'from-yellow-50 to-yellow-100',
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      text: 'text-purple-600',
      light: 'from-purple-50 to-purple-100',
    },
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color].light} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-8 h-8 ${colorClasses[color].text}`} />
        </div>
      </div>
      <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${colorClasses[color].bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
    </div>
  );
}
