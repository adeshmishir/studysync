import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import toast from 'react-hot-toast';
import { FiLogIn } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      });

      if (res.data.success) {
        toast.success("Login successful!");
        setToken(res.data.token);
        setUser(res.data.user);
        navigate("/dashboard/notes");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 font-sans px-4">
      <div className="card w-full max-w-md bg-white/90 backdrop-blur-sm border-white/50 shadow-xl">
        <div className="flex flex-col items-center justify-center gap-2 mb-8">
          <div className="p-3 bg-indigo-50 rounded-full">
            <FiLogIn className="text-3xl text-[var(--color-primary)]" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-sm">Sign in to continue your studies</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field bg-white/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field bg-white/50"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary mt-2 shadow-lg shadow-indigo-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-slate-500 mt-6">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-[var(--color-primary)] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;