import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FiLogOut,
  FiFileText,
  FiBookOpen,
  FiBarChart2,
  FiCheck,
  FiX,
  FiMessageCircle,
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
    { to: "/dashboard/chat", icon: <FiMessageCircle />, label: "AI Assistant", key: "chat" },
  ];

  return (
    <div className="flex min-h-screen font-sans bg-[var(--color-background)]">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-surface)] shadow-sm border-r border-slate-200 px-6 py-8 space-y-8 hidden md:block">
        <h1 className="text-2xl font-bold text-[var(--color-primary)] tracking-tight flex items-center gap-2">
          <FiBookOpen className="text-3xl" />
          StudySync
        </h1>

        <nav className="space-y-2 text-slate-600">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                location.pathname.includes(link.key)
                  ? "bg-[var(--color-primary)] text-white shadow-md shadow-indigo-200"
                  : "hover:bg-slate-50 hover:text-[var(--color-primary)]"
              }`}
            >
              <span className={`text-xl ${location.pathname.includes(link.key) ? "text-white" : "text-slate-400 group-hover:text-[var(--color-primary)]"}`}>
                {link.icon}
              </span>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button with Confirmation */}
        <div className="pt-8 border-t border-slate-100">
          <button
            onClick={() => setConfirmLogout(true)}
            className="flex items-center gap-3 text-sm text-slate-500 px-4 py-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors w-full"
          >
            <FiLogOut className="text-lg" />
            <span className="font-medium">Logout</span>
          </button>

          {confirmLogout && (
            <div className="flex items-center gap-3 mt-4 justify-center bg-red-50 p-2 rounded-lg">
              <span className="text-xs text-red-600 font-medium">Confirm?</span>
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="text-white bg-red-500 hover:bg-red-600 p-1 rounded transition-colors"
                title="Confirm Logout"
              >
                <FiCheck />
              </button>
              <button
                onClick={() => setConfirmLogout(false)}
                className="text-slate-500 hover:text-slate-700 p-1 rounded transition-colors"
                title="Cancel"
              >
                <FiX />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              Welcome back, Scholar
            </h2>
          </div>

          {/* Nested Routes Rendered Here */}
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
