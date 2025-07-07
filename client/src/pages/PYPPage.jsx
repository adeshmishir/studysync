import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../context/authStore';
import {
  FiUpload,
  FiTrash2,
  FiCheck,
  FiX,
  FiPlus,
  FiFilter,
  FiFileText,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';

const PYPPage = () => {
  const { token, user } = useAuthStore();
  const [papers, setPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [form, setForm] = useState({ subject: '', year: '', semester: '', term: 'MidSem' });
  const [file, setFile] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [filters, setFilters] = useState({ year: '', semester: '', term: '', subject: '' });
  const [showFilter, setShowFilter] = useState(false);

  const fetchPapers = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/pypapers', {
        headers: { token }
      });
      const papers = res.data.papers || [];
      setPapers(papers);
      setFilteredPapers(papers);
    } catch (err) {
      toast.error("Failed to load papers");
    }
  };

  const applyFilters = () => {
    let filtered = [...papers];

    if (filters.year.trim())
      filtered = filtered.filter(p => String(p.year) === filters.year.trim());

    if (filters.semester.trim())
      filtered = filtered.filter(p => String(p.semester) === filters.semester.trim());

    if (filters.term)
      filtered = filtered.filter(p => p.term === filters.term);

    if (filters.subject.trim())
      filtered = filtered.filter(p =>
        p.subject.toLowerCase().includes(filters.subject.trim().toLowerCase())
      );

    setFilteredPapers(filtered);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    try {
      const fileBase64 = await convertToBase64(file);
      const payload = { ...form, fileBase64 };
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/pypapers/upload', payload, {
        headers: { token }
      });
      if (res.data.success) {
        toast.success("Paper uploaded");
        setForm({ subject: '', year: '', semester: '', term: 'MidSem' });
        setFile(null);
        fetchPapers();
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  const deletePaper = async (id) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/pypapers/${id}`, {
        headers: { token }
      });
      if (res.data.success) {
        toast.success("Paper deleted");
        fetchPapers();
      } else {
        toast.error("Delete failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, papers]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
          📘 Previous Year Papers
        </h2>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 px-4 py-2 bg-white shadow rounded-lg text-indigo-600 hover:bg-indigo-50 transition"
        >
          <FiFilter /> {showFilter ? 'Hide Filters' : 'Show Filters'} {showFilter ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {showFilter && (
          <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FiFilter /> Filter Papers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Subject"
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value.trim() })}
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
              <input
                type="text"
                placeholder="Year"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value.trim() })}
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
              <input
                type="text"
                placeholder="Semester"
                value={filters.semester}
                onChange={(e) => setFilters({ ...filters, semester: e.target.value.trim() })}
                className="border border-gray-300 p-2 rounded-lg w-full"
              />
              <select
                value={filters.term}
                onChange={(e) => setFilters({ ...filters, term: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg w-full"
              >
                <option value="">All Terms</option>
                <option value="MidSem">MidSem</option>
                <option value="EndSem">EndSem</option>
              </select>
            </div>
          </div>
        )}

        {user?.role === 'admin' && (
          <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <FiUpload /> Upload New Paper
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                className="border border-gray-300 p-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Year"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                required
                className="border border-gray-300 p-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Semester"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                required
                className="border border-gray-300 p-2 rounded-lg"
              />
              <select
                value={form.term}
                onChange={(e) => setForm({ ...form, term: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg"
              >
                <option value="MidSem">MidSem</option>
                <option value="EndSem">EndSem</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="fileUpload" className="flex items-center gap-2 text-sm text-indigo-600 cursor-pointer">
                <FiPlus className="text-xl" /> Attach PDF
              </label>
              <input
                id="fileUpload"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              {file && <span className="text-sm text-gray-600">📄 {file.name}</span>}
            </div>

            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              <FiUpload className="inline mr-1" /> Upload
            </button>
          </form>
        )}

        {/* Papers List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <FiFileText /> Available Papers
          </h3>
          {filteredPapers.map((paper) => (
            <div key={paper._id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold text-indigo-700">{paper.subject}</h4>
                <div className="flex items-center gap-3">
                  <a
                    href={paper?.file?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition"
                  >
                    <FiFileText className="inline mr-1" /> Download
                  </a>
                  {user?.role === 'admin' && (
                    confirmDeleteId === paper._id ? (
                      <>
                        <button onClick={() => deletePaper(paper._id)} className="text-red-600 hover:text-red-800">
                          <FiCheck />
                        </button>
                        <button onClick={() => setConfirmDeleteId(null)} className="text-gray-500 hover:text-gray-700">
                          <FiX />
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmDeleteId(paper._id)} className="text-red-500 hover:text-red-700">
                        <FiTrash2 />
                      </button>
                    )
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500">
                📅 {paper.year} • 🎓 Sem {paper.semester} • 🧾 <span className="capitalize">{paper.term}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PYPPage;
