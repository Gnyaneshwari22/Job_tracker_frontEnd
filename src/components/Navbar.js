import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

const Navbar = ({ onToggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="text-xl text-gray-700 lg:hidden"
        >
          <FiMenu />
        </button>
        <h1 className="text-xl font-bold">Job Tracker</h1>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
