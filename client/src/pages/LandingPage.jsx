import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiFileText, FiCalendar, FiArrowRight } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            S
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text font-serif">
            StudySync
          </span>
        </div>
        <div className="hidden md:flex gap-4">
          <Link to="/login" className="px-4 py-2 text-slate-600 font-medium hover:text-[var(--color-primary)] transition">
            Login
          </Link>
          <Link to="/signup" className="btn-primary shadow-lg shadow-indigo-200">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-transparent to-white/50">
        <div className="max-w-4xl space-y-6 animate-fade-in">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 font-medium rounded-full text-sm mb-4 border border-indigo-100">
            Boost your academic productivity
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight font-serif leading-tight">
            Manage your studies <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              efficiently & effortlessly.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            StudySync is your all-in-one companion for tracking attendance, organizing notes, and accessing previous year papers. Designed for focus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/signup" className="btn-primary text-lg px-8 py-3 shadow-xl shadow-indigo-200 flex items-center gap-2 justify-center">
              Get Started <FiArrowRight />
            </Link>
            <Link to="/login" className="px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition shadow-sm flex items-center gap-2 justify-center">
              Already have an account?
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-2xl mb-4">
              <FiBook />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif">Notes Management</h3>
            <p className="text-slate-600 leading-relaxed">
              Create, organize, and revisit your subject notes. Keep track of what you've understood and what needs review.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-2xl mb-4">
              <FiFileText />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif">Previous Year Papers</h3>
            <p className="text-slate-600 leading-relaxed">
              Access a comprehensive archive of past exam papers. Filter by year, semester, and subject to prepare better.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-2xl mb-4">
              <FiCalendar />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif">Attendance Tracker</h3>
            <p className="text-slate-600 leading-relaxed">
              Never fall short on attendance. Track your daily classes and get visual progress updates to stay on target.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-200 bg-white/30">
        <p>&copy; {new Date().getFullYear()} StudySync. Built for scholars.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
