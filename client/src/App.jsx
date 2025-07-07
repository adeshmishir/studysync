import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import NotesPage from './pages/NotesPage';
import PYPPage from './pages/PYPPage';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import AttendancePage from './pages/AttendancePage';




const App = () => {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} /> {/* ✅ Added */}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/notes" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/attendance" element={<AttendancePage />} />
        

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="notes" element={<NotesPage />} />
          <Route path="pyp" element={<PYPPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
