import { useState, useEffect } from "react";
import { MetricCard } from "../components/dashboard/MetricCard";
import { AIInsightsPanel } from "../components/dashboard/AIInsightsPanel";
import {
   CalendarIcon,
   UsersIcon,
   DollarSignIcon,
   SparklesIcon,
   RefreshCwIcon,
} from "lucide-react";
import {
   LineChart,
   Line,
   PieChart,
   Pie,
   Cell,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import { adminDashboardAPI } from "../../api/adapters/admin";

const COLORS = ["#f472b6", "#c084fc", "#fb7185", "#a78bfa"];

export function Dashboard() {
   const { t, i18n } = useTranslation("common");
   const [stats, setStats] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [isRefreshing, setIsRefreshing] = useState(false);
   const [selectedPeriod, setSelectedPeriod] = useState<string>("week");
   const [customFromDate, setCustomFromDate] = useState<string>("");
   const [customToDate, setCustomToDate] = useState<string>("");

   const fetchStats = async (period: string = selectedPeriod, fromDate?: string, toDate?: string) => {
      try {
         if (!isRefreshing) setLoading(true);
         setError(null);
         
         const params: any = { period };
         if (period === 'custom' && fromDate && toDate) {
            params.from = fromDate;
            params.to = toDate;
         }
         
         const response = await adminDashboardAPI.getStats(params);
         setStats(response.data);
         console.log("✅ Dashboard stats loaded:", response.data);
      } catch (error) {
         const errorMsg = error instanceof Error ? error.message : "Failed to fetch dashboard stats";
         setError(errorMsg);
         console.error("❌ Dashboard error:", errorMsg);
      } finally {
         setLoading(false);
         setIsRefreshing(false);
      }
   };

   useEffect(() => {
      fetchStats();
      // Auto-refresh every 5 minutes
      const interval = setInterval(() => fetchStats(), 5 * 60 * 1000);
      return () => clearInterval(interval);
   }, []);

   const handleRefresh = async () => {
      setIsRefreshing(true);
      await fetchStats(selectedPeriod, customFromDate, customToDate);
   };

   const handlePeriodChange = (period: string) => {
      setSelectedPeriod(period);
      if (period !== 'custom') {
         fetchStats(period);
      }
   };

   const handleCustomDateApply = () => {
      if (customFromDate && customToDate) {
         fetchStats('custom', customFromDate, customToDate);
      }
   };

   if (loading) {
      return (
         <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
         </div>
      );
   }

   const bookingData = stats?.charts?.bookings || [];
   const serviceData = stats?.charts?.services || [];
   const revenueData = stats?.charts?.revenue || [];

   return (
      <div className="space-y-6">
         {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
               <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
               </div>
               <div className="flex-1">
                  <p className="text-sm text-red-700">{error}</p>
               </div>
               <button
                  onClick={handleRefresh}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
               >
                  Retry
               </button>
            </div>
         )}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">
                  {t("admin.dashboard.title")}
               </h1>
               <p className="text-gray-600 mt-1">
                  {t("admin.dashboard.welcome")}
               </p>
            </div>
            <div className="flex items-center gap-4">
               <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-50 transition-all"
               >
                  <RefreshCwIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
               </button>
               <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString(
                     i18n.language === "vi" ? "vi-VN" : "en-US",
                     {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                     }
                  )}
               </div>
            </div>
         </div>
         
         {/* Period Selector */}
         <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
               <span className="text-sm font-medium text-gray-700">Filter by period:</span>
               {['today', 'week', 'month', 'year'].map((period) => (
                  <button
                     key={period}
                     onClick={() => handlePeriodChange(period)}
                     className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedPeriod === period
                           ? 'bg-pink-500 text-white'
                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                     }`}
                  >
                     {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
               ))}
               <button
                  onClick={() => setSelectedPeriod('custom')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                     selectedPeriod === 'custom'
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
               >
                  Custom
               </button>
            </div>
            
            {/* Custom Date Range Picker */}
            {selectedPeriod === 'custom' && (
               <div className="mt-4 flex flex-wrap items-center gap-3">
                  <input
                     type="date"
                     value={customFromDate}
                     onChange={(e) => setCustomFromDate(e.target.value)}
                     className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                     type="date"
                     value={customToDate}
                     onChange={(e) => setCustomToDate(e.target.value)}
                     className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                     onClick={handleCustomDateApply}
                     disabled={!customFromDate || !customToDate}
                     className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-50 transition-all text-sm font-medium"
                  >
                     Apply
                  </button>
               </div>
            )}
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
               title={t("admin.dashboard.totalBookingsToday")}
               value={
                  stats?.metrics?.totalBookingsToday?.value?.toString() || "0"
               }
               change={stats?.metrics?.totalBookingsToday?.change || "0%"}
               icon={CalendarIcon}
               gradient="from-pink-400 to-pink-500"
            />
            <MetricCard
               title={t("admin.dashboard.activeMembers")}
               value={stats?.metrics?.activeMembers?.value?.toString() || "0"}
               change={stats?.metrics?.activeMembers?.change || "0%"}
               icon={UsersIcon}
               gradient="from-purple-400 to-purple-500"
            />
            <MetricCard
               title={t("admin.dashboard.revenue")}
               value={stats?.metrics?.revenue?.value || "$0"}
               change={stats?.metrics?.revenue?.change || "0%"}
               icon={DollarSignIcon}
               gradient="from-rose-400 to-rose-500"
            />
            <MetricCard
               title={t("admin.dashboard.satisfaction")}
               value={stats?.metrics?.satisfaction?.value?.toString() || "0"}
               icon={SparklesIcon}
               gradient="from-violet-400 to-violet-500"
            />
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm">
               <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("admin.dashboard.recentBookings")}
               </h3>
               <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bookingData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
                     <XAxis dataKey="name" stroke="#9ca3af" />
                     <YAxis stroke="#9ca3af" />
                     <Tooltip
                        contentStyle={{
                           backgroundColor: "rgba(255, 255, 255, 0.95)",
                           border: "1px solid #fecdd3",
                           borderRadius: "12px",
                        }}
                     />
                     <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="url(#colorGradient)"
                        strokeWidth={3}
                        dot={{
                           fill: "#ec4899",
                           r: 4,
                        }}
                     />
                     <defs>
                        <linearGradient
                           id="colorGradient"
                           x1="0"
                           y1="0"
                           x2="1"
                           y2="0">
                           <stop offset="0%" stopColor="#f472b6" />
                           <stop offset="100%" stopColor="#c084fc" />
                        </linearGradient>
                     </defs>
                  </LineChart>
               </ResponsiveContainer>
            </div>
            <AIInsightsPanel />
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm">
               <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("admin.dashboard.revenueTrend")}
               </h3>
               <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
                     <XAxis dataKey="name" stroke="#9ca3af" />
                     <YAxis stroke="#9ca3af" />
                     <Tooltip
                        contentStyle={{
                           backgroundColor: "rgba(255, 255, 255, 0.95)",
                           border: "1px solid #fecdd3",
                           borderRadius: "12px",
                        }}
                        formatter={(value) => `$${value.toLocaleString()}`}
                     />
                     <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{
                           fill: "#10b981",
                           r: 4,
                        }}
                     />
                  </LineChart>
               </ResponsiveContainer>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 shadow-sm">
               <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("admin.dashboard.topServices")}
               </h3>
               <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                     <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value">
                        {serviceData.map((_entry: any, index: number) => (
                           <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                           />
                        ))}
                     </Pie>
                     <Tooltip
                        contentStyle={{
                           backgroundColor: "rgba(255, 255, 255, 0.95)",
                           border: "1px solid #fecdd3",
                           borderRadius: "12px",
                        }}
                     />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
   );
}

export default Dashboard;
