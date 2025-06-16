import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "block px-4 py-2 bg-blue-600 text-white rounded"
      : "block px-4 py-2 text-gray-200 hover:bg-blue-700 hover:text-white rounded";

  return (
    <aside className="w-64 h-screen bg-gray-800 p-4 text-sm">
      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/applications" className={linkClass}>
          Applications
        </NavLink>
        <NavLink to="/companies" className={linkClass}>
          Companies
        </NavLink>
        <NavLink to="/saved-jobs" className={linkClass}>
          Saved Jobs
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
