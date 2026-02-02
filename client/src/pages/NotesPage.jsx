import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../context/authStore';
import { FiEdit, FiTrash2, FiPlus, FiX, FiCheck } from 'react-icons/fi';

const NotesPage = () => {
  const { token } = useAuthStore();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', subject: '', status: 'Pending' });
  const [files, setFiles] = useState([]);
  const [editNoteId, setEditNoteId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [showForm, setShowForm] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/notes', {
        headers: { token },
      });
      setNotes(res.data.notes || []);
    } catch (err) {
      toast.error("Failed to load notes");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    formData.append('subject', form.subject);
    formData.append('status', form.status);
    files.forEach((file) => formData.append('attachments', file));

    try {
      const url = editNoteId
        ? `${import.meta.env.VITE_BACKEND_URL}/api/notes/${editNoteId}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/notes/add`;
      const method = editNoteId ? 'put' : 'post';

      const res = await axios({
        method,
        url,
        data: formData,
        headers: { token },
      });

      if (res.data.success) {
        toast.success(editNoteId ? "Note updated!" : "Note added!");
        setForm({ title: '', content: '', subject: '', status: 'Pending' });
        setFiles([]);
        setEditNoteId(null);
        setShowForm(false);
        fetchNotes();
      } else {
        toast.error("Failed to save note");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteNote = async (id) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/notes/${id}`, {
        headers: { token },
      });

      if (res.data.success) {
        toast.success("Note deleted");
        setConfirmDeleteId(null);
        fetchNotes();
      } else {
        toast.error("Failed to delete note");
      }
    } catch (err) {
      toast.error("Error deleting note");
    }
  };

  const startEdit = (note) => {
    setEditNoteId(note._id);
    setForm({
      title: note.title,
      content: note.content,
      subject: note.subject,
      status: note.status,
    });
    setFiles([]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
            Your Notes
          </h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditNoteId(null);
              setForm({ title: '', content: '', subject: '', status: 'Pending' });
              setFiles([]);
            }}
            className="flex items-center gap-2 btn-primary rounded-full px-5"
          >
            <FiPlus /> {showForm ? "Cancel" : "Add Note"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="card space-y-5 animate-fade-in"
          >
            {/* Form Inputs */}
            {['title', 'subject', 'content'].map((field, i) => (
              <div key={i} className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 capitalize">{field}</label>
                {field !== 'content' ? (
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder={`Enter ${field}`}
                    required={field === 'title'}
                    className="input-field"
                  />
                ) : (
                  <textarea
                    rows={4}
                    required
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Write your note..."
                  />
                )}
              </div>
            ))}

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="input-field bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Understood">Understood</option>
                <option value="Revisit">Revisit</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label htmlFor="fileUpload" className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] cursor-pointer hover:text-[var(--color-primary-hover)]">
                <FiPlus className="text-lg" />
                Attach Files
              </label>
              <input
                id="fileUpload"
                type="file"
                accept=".pdf,image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              {files.length > 0 && (
                <ul className="text-sm text-slate-600 space-y-1">
                  {files.map((file, i) => (
                    <li key={i} className="flex justify-between items-center">
                      <span>📄 {file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="btn-primary"
              >
                {editNoteId ? 'Update Note' : 'Save Note'}
              </button>
              {editNoteId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditNoteId(null);
                    setForm({ title: '', content: '', subject: '', status: 'Pending' });
                    setFiles([]);
                    setShowForm(false);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* Display Notes or Empty State */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
               <div className="w-16 h-16 bg-purple-50 text-purple-400 rounded-full flex items-center justify-center text-3xl mb-4">
                <FiEdit />
              </div>
              <h3 className="text-xl font-bold text-slate-700">No notes found</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                Create your first note to start organizing your thoughts and study materials.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 text-[var(--color-primary)] font-medium hover:underline"
              >
                Create new note &rarr;
              </button>
            </div>
          ) : (
            notes.map((note) => (
            <div key={note._id} className="card hover:shadow-md transition space-y-3 relative group">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{note.title}</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">{note.subject}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(note)} className="text-slate-400 hover:text-[var(--color-primary)] p-1 rounded transition-colors">
                    <FiEdit />
                  </button>
                  {confirmDeleteId === note._id ? (
                    <div className="flex items-center gap-2 bg-red-50 p-1 rounded">
                      <button
                        onClick={() => deleteNote(note._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Confirm Delete"
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-slate-500 hover:text-slate-700"
                        title="Cancel"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDeleteId(note._id)} className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors">
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                 <span className={`text-xs px-2 py-1 rounded-full font-medium border ${
                  note.status === 'Understood'
                    ? 'text-green-700 bg-green-50 border-green-200'
                    : note.status === 'Revisit'
                    ? 'text-red-700 bg-red-50 border-red-200'
                    : 'text-yellow-700 bg-yellow-50 border-yellow-200'
                }`}>
                  {note.status}
                </span>
              </div>

              <p className="text-slate-700 leading-relaxed font-sans">
                {expandedNotes[note._id] ? note.content : note.content.length > 150 ? note.content.slice(0, 150) + '...' : note.content}
              </p>

              {note.content.length > 150 && (
                <button
                  onClick={() =>
                    setExpandedNotes((prev) => ({
                      ...prev,
                      [note._id]: !prev[note._id],
                    }))
                  }
                  className="text-sm text-[var(--color-primary)] hover:underline font-medium"
                >
                  {expandedNotes[note._id] ? 'Read Less' : 'Read More'}
                </button>
              )}

              {/* Attachment Preview */}
              {note.attachments?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="font-medium text-xs text-slate-400 uppercase mb-2">Attachments</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {note.attachments.map((att, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                      {att?.format === 'pdf' && att?.url ? (
                        <div className="space-y-2">
                            <span className="text-xs font-semibold text-slate-500 block">PDF Document</span>
                             <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-primary)] hover:underline block truncate">
                                View PDF
                             </a>
                        </div>
                      ) : att?.url ? (
                         <div className="flex items-center gap-2">
                            <span className="text-lg">📎</span>
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-slate-700 hover:text-[var(--color-primary)] truncate block"
                            >
                              File attachment {i + 1}
                            </a>
                        </div>
                      ) : (
                        <span className="text-red-500 text-xs">⚠️ Invalid attachment</span>
                      )}
                    </div>
                  ))}
                  </div>
                </div>
              )}
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
