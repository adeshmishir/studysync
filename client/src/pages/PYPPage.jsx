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
  FiArrowRight,
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
  const [previewUrl, setPreviewUrl] = useState(null);

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
    <div className="min-h-screen bg-[var(--color-background)] py-10 px-4">
      {/* PDF Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/20">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FiFileText className="text-indigo-600" /> Paper Preview
              </h3>
              <button 
                onClick={() => setPreviewUrl(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 relative">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`}
                className="w-full h-full border-none"
                title="Paper Preview"
              />
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
               <a
                  href={previewUrl}
                  download
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                >
                  Download This Paper
                </a>
               <button 
                onClick={() => setPreviewUrl(null)}
                className="px-6 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
          📘 Previous Year Papers
        </h2>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-slate-200 rounded-lg text-[var(--color-primary)] hover:bg-indigo-50 transition"
        >
          <FiFilter /> {showFilter ? 'Hide Filters' : 'Show Filters'} {showFilter ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {showFilter && (
          <div className="card space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <FiFilter /> Filter Papers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Subject"
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value.trim() })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Year"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value.trim() })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Semester"
                value={filters.semester}
                onChange={(e) => setFilters({ ...filters, semester: e.target.value.trim() })}
                className="input-field"
              />
              <select
                value={filters.term}
                onChange={(e) => setFilters({ ...filters, term: e.target.value })}
                className="input-field bg-white"
              >
                <option value="">All Terms</option>
                <option value="MidSem">MidSem</option>
                <option value="EndSem">EndSem</option>
              </select>
            </div>
          </div>
        )}

        {user?.role === 'admin' && (
          <form onSubmit={handleUpload} className="card space-y-4">
            <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
              <FiUpload /> Upload New Paper
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                className="input-field"
              />
              <input
                type="number"
                placeholder="Year"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                required
                className="input-field"
              />
              <input
                type="number"
                placeholder="Semester"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                required
                className="input-field"
              />
              <select
                value={form.term}
                onChange={(e) => setForm({ ...form, term: e.target.value })}
                className="input-field bg-white"
              >
                <option value="MidSem">MidSem</option>
                <option value="EndSem">EndSem</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="fileUpload" className="flex items-center gap-2 text-sm text-[var(--color-primary)] cursor-pointer hover:underline font-medium">
                <FiPlus className="text-xl" /> Attach PDF
              </label>
              <input
                id="fileUpload"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              {file && <span className="text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">📄 {file.name}</span>}
            </div>

            <button type="submit" className="btn-primary flex items-center gap-2">
              <FiUpload className="inline" /> Upload
            </button>
          </form>
        )}

        {/* Papers List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2 font-serif">
            <FiFileText /> Available Papers
          </h3>
          {filteredPapers.length === 0 ? (
            <div className="card py-16 text-center space-y-4 flex flex-col items-center justify-center bg-white/40 border-dashed border-2">
               <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center text-3xl">
                <FiFileText />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-700">No papers found</h4>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
              </div>
            </div>
          ) : (
            filteredPapers.map((paper) => (
            <div key={paper._id} className="card hover:shadow-md transition space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold text-slate-800">{paper.subject}</h4>
                <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewUrl(paper.file.url)}
                    className="text-sm bg-indigo-50 text-[var(--color-primary)] px-4 py-1.5 rounded-full hover:bg-indigo-100 transition font-semibold border border-indigo-100 flex items-center gap-2 shadow-sm"
                    title="View Paper"
                  >
                    <FiFileText /> View Paper
                  </button>
                  {user?.role === 'admin' && (
                    confirmDeleteId === paper._id ? (
                      <div className="flex items-center gap-1 bg-red-50 p-1 rounded">
                        <button onClick={() => deletePaper(paper._id)} className="text-red-600 hover:text-red-800">
                          <FiCheck />
                        </button>
                        <button onClick={() => setConfirmDeleteId(null)} className="text-slate-500 hover:text-slate-700">
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDeleteId(paper._id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <FiTrash2 />
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

              <p className="text-sm text-slate-500 font-medium">
                📅 {paper.year} • 🎓 Sem {paper.semester} • 🧾 <span className="capitalize">{paper.term}</span>
              </p>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default PYPPage;
