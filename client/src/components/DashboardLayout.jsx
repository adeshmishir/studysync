import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FiLogOut,
  FiFileText,
  FiBookOpen,
  FiBarChart2,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import useAuthStore from '../context/authStore';

const DashboardLayout = () => {
  const { logout } = useAuthStore();
  const location = useLocation();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const navLinks = [
    { to: "/dashboard/notes", icon: <FiBookOpen />, label: "Notes", key: "notes" },
    { to: "/dashboard/pyp", icon: <FiFileText />, label: "PY Papers", key: "pyp" },
    { to: "/dashboard/attendance", icon: <FiBarChart2 />, label: "Attendance", key: "attendance" },
  ];

  return (
    <div className="flex min-h-screen font-inter bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md px-6 py-8 space-y-8 hidden md:block">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">📚 StudySync</h1>

        <nav className="space-y-4 text-gray-700">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-md hover:text-indigo-600 hover:bg-indigo-50 transition ${
                location.pathname.includes(link.key)
                  ? "text-indigo-700 bg-indigo-100 font-semibold"
                  : ""
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button with Confirmation */}
        <div className="relative">
          <button
            onClick={() => setConfirmLogout(true)}
            className="flex items-center gap-2 text-sm text-red-600 px-3 py-2 hover:bg-red-100 rounded-md transition"
          >
            <FiLogOut />
            Logout
          </button>

          {confirmLogout && (
            <div className="flex items-center gap-3 mt-2 ml-1">
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="text-green-600 hover:text-green-800 text-xl"
                title="Confirm Logout"
              >
                <FiCheck />
              </button>
              <button
                onClick={() => setConfirmLogout(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
                title="Cancel"
              >
                <FiX />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-700">Welcome to StudySync</h2>
        </div>

        {/* Nested Routes Rendered Here */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
