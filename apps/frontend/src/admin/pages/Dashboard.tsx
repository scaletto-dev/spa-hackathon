import { MetricCard } from '../components/dashboard/MetricCard';
import { AIInsightsPanel } from '../components/dashboard/AIInsightsPanel';
import { CalendarIcon, UsersIcon, DollarSignIcon, SparklesIcon } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const bookingData = [{
  name: 'Mon',
  bookings: 45
}, {
  name: 'Tue',
  bookings: 52
}, {
  name: 'Wed',
  bookings: 48
}, {
  name: 'Thu',
  bookings: 61
}, {
  name: 'Fri',
  bookings: 70
}, {
  name: 'Sat',
  bookings: 85
}, {
  name: 'Sun',
  bookings: 58
}];
const serviceData = [{
  name: 'Facial',
  value: 35
}, {
  name: 'Massage',
  value: 28
}, {
  name: 'Hair',
  value: 20
}, {
  name: 'Nails',
  value: 17
}];
const COLORS = ['#f472b6', '#c084fc', '#fb7185', '#a78bfa'];
export function Dashboard() {
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here is your clinic overview
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Bookings Today" value="47" change="+12%" icon={CalendarIcon} gradient="from-pink-400 to-pink-500" />
        <MetricCard title="Active Members" value="1,284" change="+8%" icon={UsersIcon} gradient="from-purple-400 to-purple-500" />
        <MetricCard title="Revenue This Week" value="$12,450" change="+15%" icon={DollarSignIcon} gradient="from-rose-400 to-rose-500" />
        <MetricCard title="AI Recommendations" value="23" icon={SparklesIcon} gradient="from-violet-400 to-violet-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Bookings Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #fecdd3',
              borderRadius: '12px'
            }} />
              <Line type="monotone" dataKey="bookings" stroke="url(#colorGradient)" strokeWidth={3} dot={{
              fill: '#ec4899',
              r: 4
            }} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <AIInsightsPanel />
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Service Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={serviceData} cx="50%" cy="50%" labelLine={false} label={({
            name,
            percent
          }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
              {serviceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #fecdd3',
            borderRadius: '12px'
          }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>;
}