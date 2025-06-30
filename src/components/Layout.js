import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // ⬅️ NEW

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-40 transition-opacity lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)} // ⬅️ toggle btn
      />

      <div className="flex-1 flex flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 overflow-y-auto bg-gray-100 h-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
