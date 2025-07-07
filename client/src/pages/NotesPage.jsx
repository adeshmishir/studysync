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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
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
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
          >
            <FiPlus /> {showForm ? "Cancel" : "Add Note"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 space-y-5 animate-fade-in"
          >
            {/* Form Inputs */}
            {['title', 'subject', 'content'].map((field, i) => (
              <div key={i} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                {field !== 'content' ? (
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder={`Enter ${field}`}
                    required={field === 'title'}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                ) : (
                  <textarea
                    rows={4}
                    required
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                    placeholder="Write your note..."
                  />
                )}
              </div>
            ))}

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="Pending">Pending</option>
                <option value="Understood">Understood</option>
                <option value="Revisit">Revisit</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label htmlFor="fileUpload" className="flex items-center gap-2 text-sm font-medium text-indigo-600 cursor-pointer hover:text-indigo-800">
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
                <ul className="text-sm text-gray-600 space-y-1">
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
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                {editNoteId ? 'Update Note' : 'Add Note'}
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
                  className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* Display Notes */}
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note._id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-bold text-indigo-700">{note.title}</h4>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(note)} className="text-indigo-600 hover:text-indigo-800">
                    <FiEdit />
                  </button>
                  {confirmDeleteId === note._id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteNote(note._id)}
                        className="text-red-600 hover:text-red-800 text-lg"
                        title="Confirm Delete"
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-gray-500 hover:text-gray-700 text-lg"
                        title="Cancel"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDeleteId(note._id)} className="text-red-500 hover:text-red-700">
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500">
                {note.subject}
                <span className="mx-2 text-gray-400">•</span>
                <span className={`font-medium ${
                  note.status === 'Understood'
                    ? 'text-green-600 bg-green-100 px-2 py-0.5 rounded-full'
                    : note.status === 'Revisit'
                    ? 'text-red-600 bg-red-100 px-2 py-0.5 rounded-full'
                    : 'text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full'
                }`}>
                  {note.status}
                </span>
              </p>

              <p className="text-gray-700">
                {expandedNotes[note._id] ? note.content : note.content.length > 100 ? note.content.slice(0, 100) + '...' : note.content}
              </p>

              {note.content.length > 100 && (
                <button
                  onClick={() =>
                    setExpandedNotes((prev) => ({
                      ...prev,
                      [note._id]: !prev[note._id],
                    }))
                  }
                  className="text-sm text-blue-600 hover:underline"
                >
                  {expandedNotes[note._id] ? 'View Less' : 'View More'}
                </button>
              )}

              {/* Attachment Preview */}
              {note.attachments?.length > 0 && (
                <div className="mt-2 space-y-3">
                  <p className="font-medium text-sm">Attachments:</p>
                  {note.attachments.map((att, i) => (
                    <div key={i}>
                      {att?.format === 'pdf' && att?.url ? (
                        <iframe
                          src={att.url}
                          title={`PDF-${i}`}
                          width="100%"
                          height="500px"
                          className="rounded border"
                        />
                      ) : att?.url ? (
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm block"
                        >
                          📎 {att.format?.toUpperCase() || "File"} {i + 1}
                        </a>
                      ) : (
                        <span className="text-red-500 text-sm">⚠️ Invalid attachment</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
