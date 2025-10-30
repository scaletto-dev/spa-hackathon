import { useState, useEffect } from "react";
import { MetricCard } from "../components/dashboard/MetricCard";
import { AIInsightsPanel } from "../components/dashboard/AIInsightsPanel";
import {
   CalendarIcon,
   UsersIcon,
   DollarSignIcon,
   SparklesIcon,
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

   useEffect(() => {
      const fetchStats = async () => {
         try {
            setLoading(true);
            const response = await adminDashboardAPI.getStats();
            setStats(response.data);
         } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchStats();
   }, []);

   if (loading) {
      return (
         <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
         </div>
      );
   }

   const bookingData = stats?.charts?.bookings || [];
   const serviceData = stats?.charts?.services || [];

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-800">
                  {t("admin.dashboard.title")}
               </h1>
               <p className="text-gray-600 mt-1">
                  {t("admin.dashboard.welcome")}
               </p>
            </div>
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
                     label={({
                        name,
                        percent,
                     }: {
                        name: string;
                        percent: number;
                     }) => `${name} ${(percent * 100).toFixed(0)}%`}
                     outerRadius={100}
                     fill="#8884d8"
                     dataKey="value">
                     {serviceData.map((_entry, index) => (
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
   );
}

export default Dashboard;
