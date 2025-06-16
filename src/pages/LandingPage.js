import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ToastContainer />
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Job Application Tracker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your job search with our powerful tracking tools. Never
            miss a follow-up and stay organized throughout your job hunt.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              title: "Application Tracking",
              icon: "📝",
              desc: "Log all your job applications in one place",
            },
            {
              title: "Reminders",
              icon: "⏰",
              desc: "Get notified about important follow-ups",
            },
            {
              title: "Company Profiles",
              icon: "🏢",
              desc: "Store information about companies you're applying to",
            },
            {
              title: "Progress Analytics",
              icon: "📊",
              desc: "Visualize your job search progress",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Auth Tabs */}
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 font-medium ${
                activeTab === "login"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 font-medium ${
                activeTab === "register"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>
          <div className="p-6">
            {activeTab === "login" ? (
              <LoginPage embedded={true} />
            ) : (
              <RegisterPage embedded={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
