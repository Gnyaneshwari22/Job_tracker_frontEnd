import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ApplicationsPage from "../pages/ApplicationsPage";
import ApplicationDetailPage from "../pages/ApplicationDetailPage";
import ProfilePage from "../pages/ProfilePage";
import CompaniesPage from "../pages/CompaniesPage";
import SavedJobsPage from "../pages/SavedJobsPage";
import NotFoundPage from "../pages/NotFoundPage";
import LandingPage from "../pages/LandingPage";

const AppRoutes = [
  { path: "/login", element: <LoginPage />, isProtected: false },
  { path: "/", element: <LandingPage />, isProtected: false }, // 👈 Updated default route
  { path: "/register", element: <RegisterPage />, isProtected: false },
  { path: "/dashboard", element: <DashboardPage />, isProtected: true },
  { path: "/applications", element: <ApplicationsPage />, isProtected: true },
  {
    path: "/applications/:id",
    element: <ApplicationDetailPage />,
    isProtected: true,
  },
  { path: "/profile", element: <ProfilePage />, isProtected: true },
  { path: "/companies", element: <CompaniesPage />, isProtected: true },
  { path: "/saved-jobs", element: <SavedJobsPage />, isProtected: true },
  { path: "*", element: <NotFoundPage />, isProtected: false },
];

export default AppRoutes;
