import React from 'react';
import useAuthStore from '../context/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] font-sans px-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-indigo-200 border-4 border-white">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-sm"></div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight font-serif">
            Welcome back, <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
               {user?.fullName || 'Scholar'}!
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
            Your personal workspace is ready. You have access to your notes, attendance tracker, and previous year papers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
             <div className="text-indigo-600 font-bold text-lg mb-1">Status</div>
             <div className="text-slate-400 text-sm">Account Active</div>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
             <div className="text-purple-600 font-bold text-lg mb-1">Role</div>
             <div className="text-slate-400 text-sm capitalize">{user?.role || 'User'}</div>
          </div>
        </div>

        <p className="text-slate-400 text-sm italic">
          💡 Tip: Use the side navigation to start organizing your study materials!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
