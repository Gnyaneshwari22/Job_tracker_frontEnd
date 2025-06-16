import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">Job Tracker</h1>
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
