import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiClipboard,
  FiBriefcase,
  FiBookmark,
  FiUser,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

const Sidebar = ({ isOpen, collapsed, onToggleCollapse }) => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center px-4 py-2 bg-blue-600 text-white rounded"
      : "flex items-center px-4 py-2 text-gray-200 hover:bg-blue-700 hover:text-white rounded";

  const iconMap = {
    "/dashboard": <FiHome />,
    "/applications": <FiClipboard />,
    "/companies": <FiBriefcase />,
    "/saved-jobs": <FiBookmark />,
    "/profile": <FiUser />,
  };

  const routes = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/applications", label: "Applications" },
    { to: "/companies", label: "Companies" },
    { to: "/saved-jobs", label: "Saved Jobs" },
    { to: "/profile", label: "Profile" },
  ];

  return (
    <aside
      className={`fixed z-40 top-0 left-0 h-full bg-gray-800 text-sm transition-transform duration-300 ease-in-out 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:translate-x-0 lg:relative lg:flex flex-col 
      ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="p-4 flex-1 space-y-2">
        {routes.map((r) => (
          <NavLink key={r.to} to={r.to} className={linkClass}>
            <span className="mr-3 text-lg">{iconMap[r.to]}</span>
            {!collapsed && <span>{r.label}</span>}
          </NavLink>
        ))}
      </div>

      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="text-white bg-gray-700 hover:bg-gray-600 w-full py-2"
      >
        {collapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
      </button>
    </aside>
  );
};

export default Sidebar;
