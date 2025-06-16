import { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import Layout from "../components/Layout";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import {
  FiCalendar,
  FiBriefcase,
  FiMail,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const DashboardPage = () => {
  const [reminders, setReminders] = useState([]);
  const [stats, setStats] = useState({
    total_applications: 0,
    status_summary: [],
    recent_activity: [],
    upcoming_interviews: [],
  });

  const statusIcons = {
    applied: <FiBriefcase className="text-blue-500" />,
    interviewed: <FiMail className="text-purple-500" />,
    offered: <FiCheckCircle className="text-green-500" />,
    rejected: <FiXCircle className="text-red-500" />,
    pending: <FiClock className="text-yellow-500" />,
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/dashboard/overview");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await axios.get("/reminders/get");
        console.log("Fetched reminders:", res.data.data);
        setReminders(res.data.data);
      } catch (err) {
        console.error("Failed to load reminders", err);
      }
    };
    fetchReminders();
  }, []);

  // Prepare data for charts
  const statusData = {
    labels: stats.status_summary.map(
      (item) => item.status.charAt(0).toUpperCase() + item.status.slice(1)
    ),
    datasets: [
      {
        data: stats.status_summary.map((item) => item.count),
        backgroundColor: [
          "#3B82F6", // blue
          "#8B5CF6", // purple
          "#10B981", // green
          "#EF4444", // red
          "#F59E0B", // yellow
        ],
        hoverBackgroundColor: [
          "#2563EB",
          "#7C3AED",
          "#059669",
          "#DC2626",
          "#D97706",
        ],
      },
    ],
  };

  const activityData = {
    labels: stats.recent_activity.map((item) => item.application_date),
    datasets: [
      {
        label: "Applications",
        data: stats.recent_activity.map((item) => item.count),
        backgroundColor: "#3B82F6",
        borderColor: "#2563EB",
        borderWidth: 2,
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const statusBarData = {
    labels: stats.status_summary.map(
      (item) => item.status.charAt(0).toUpperCase() + item.status.slice(1)
    ),
    datasets: [
      {
        label: "Applications by Status",
        data: stats.status_summary.map((item) => item.count),
        backgroundColor: "#8B5CF6",
        borderColor: "#7C3AED",
        borderWidth: 1,
      },
    ],
  };

  const isDueTomorrow = (reminder) => {
    const reminderDate = new Date(reminder.reminder_date);
    reminderDate.setHours(0, 0, 0, 0); // Normalize the reminder date to midnight

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return !reminder.is_sent && reminderDate.getTime() === tomorrow.getTime();
  };
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Applications
                </p>
                <p className="text-3xl font-bold mt-1">
                  {stats.total_applications}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiBriefcase className="text-blue-500 text-xl" />
              </div>
            </div>
          </div>

          {stats.status_summary.slice(0, 3).map((status) => (
            <div
              key={status.status}
              className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 capitalize">
                    {status.status}
                  </p>
                  <p className="text-3xl font-bold mt-1">{status.count}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  {statusIcons[status.status] || (
                    <FiBriefcase className="text-purple-500 text-xl" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Application Status</h3>
            <div className="h-64">
              <Doughnut
                data={statusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.label}: ${
                            context.raw
                          } (${Math.round(context.parsed)}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Recent Activity (30 Days)
            </h3>
            <div className="h-64">
              <Line
                data={activityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `Applications: ${context.raw}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reminders */}
          <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiCalendar className="mr-2 text-indigo-500" /> Upcoming Reminders
            </h3>

            {console.log(
              "Filtered reminders:",
              reminders.filter(isDueTomorrow)
            )}

            {reminders.filter(isDueTomorrow).length > 0 ? (
              <ul className="space-y-3">
                {reminders
                  .filter(isDueTomorrow)
                  .sort(
                    (a, b) =>
                      new Date(a.reminder_date) - new Date(b.reminder_date)
                  )
                  .map((r) => (
                    <li
                      key={r.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {r.message || "Follow-up reminder"}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(r.reminder_date).toLocaleString()}
                          </p>
                        </div>
                        <button className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition">
                          Mark Done
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming reminders</p>
                <p className="text-xs text-gray-400 mt-2">
                  Showing reminders for:{" "}
                  {new Date(
                    new Date().setDate(new Date().getDate() + 1)
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Status Breakdown */}
          <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Status Breakdown</h3>
            <div className="h-64">
              <Bar
                data={statusBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Upcoming Interviews */}
          {/* <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Upcoming Interviews</h3>
            {stats.upcoming_interviews?.length > 0 ? (
              <ul className="space-y-3">
                {stats.upcoming_interviews.map((interview) => (
                  <li
                    key={interview.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{interview.company}</p>
                        <p className="text-sm text-gray-500">
                          {interview.position}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(
                            interview.interview_date
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(
                            interview.interview_date
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming interviews</p>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
