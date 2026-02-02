import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiArrowLeft, FiTrash2, FiCheck, FiX, FiEdit3, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AttendancePage = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [expanded, setExpanded] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/attendance", { headers: { token } });
      setSubjects(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load attendance data");
    }
  };

  const addSubject = async () => {
    if (!newSubject.trim()) return toast.error("Enter a subject");
    try {
      await axios.post("/api/attendance/add-subject", { subject: newSubject }, { headers: { token } });
      setNewSubject("");
      fetchData();
    } catch {
      toast.error("Add failed");
    }
  };

  const markAttendance = async (id, status) => {
    try {
      await axios.patch(`/api/attendance/mark/${id}`, { status }, { headers: { token } });
      fetchData();
    } catch {
      toast.error("Mark failed");
    }
  };

  const deleteSubject = async (id) => {
    try {
      await axios.delete(`/api/attendance/${id}`, { headers: { token } });
      setConfirmDeleteId(null);
      fetchData();
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const updateSubject = async (id) => {
    try {
      await axios.patch(`/api/attendance/edit/${id}`, { subject: editName }, { headers: { token } });
      setEditingId(null);
      setEditName("");
      fetchData();
    } catch {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/notes")}
            className="text-slate-500 text-2xl hover:text-[var(--color-primary)] transition-colors"
            title="Back to Dashboard"
          >
            <FiArrowLeft />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            📊 Attendance Tracker
          </h1>
        </div>

        {/* Add Subject */}
        <div className="flex gap-2 items-center bg-[var(--color-surface)] p-2 rounded-xl shadow-sm border border-slate-200">
          <input
            type="text"
            placeholder="Add a new subject..."
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="flex-1 w-full bg-transparent px-4 py-2 outline-none text-slate-700 placeholder:text-slate-400"
          />
          <button
            onClick={addSubject}
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <FiPlus /> Add
          </button>
        </div>

        {/* Subjects List or Empty State */}
        {subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center text-3xl">
              <FiPlus />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-700">No subjects yet</h3>
              <p className="text-slate-500 max-w-xs mx-auto mt-2">
                Please add your first subject above to get started with tracking your attendance.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             {subjects.length > 1 && (
               <div className="flex items-center justify-between mb-2">
                 <h2 className="text-lg font-semibold text-slate-600 pl-1">Your Subjects ({subjects.length})</h2>
                 <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tap to expand</p>
               </div>
             )}
             {subjects.map((s) => {
              const percentage = s.totalClasses
                ? Math.round((s.attendedClasses / s.totalClasses) * 100)
                : 0;
              const progressColor = percentage >= 75 ? "bg-emerald-500" : "bg-rose-500";
              const recentHistory = [...s.history].reverse().slice(0, 5);
              const isExpanded = expanded[s._id] || false;

              return (
                <div
                  key={s._id}
                  className="card !p-0 overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Subject Row */}
                  <div
                    className="flex justify-between items-center p-5 cursor-pointer"
                    onClick={() => setExpanded((prev) => ({ ...prev, [s._id]: !prev[s._id] }))}
                  >
                    {editingId === s._id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="input-field py-1"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button onClick={(e) => { e.stopPropagation(); updateSubject(s._id); }} className="text-emerald-600 hover:text-emerald-700 p-1">
                          <FiCheck size={20} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="text-slate-400 hover:text-slate-600 p-1">
                          <FiX size={20} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${percentage >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {percentage}%
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">{s.subject}</h2>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingId(s._id);
                              setEditName(s.subject);
                            }}
                            className="text-slate-400 hover:text-[var(--color-primary)] transition-colors"
                            title="Edit Subject"
                          >
                            <FiEdit3 size={18} />
                          </button>
                          {confirmDeleteId === s._id ? (
                            <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSubject(s._id);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FiCheck />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDeleteId(null);
                                }}
                                className="text-slate-500 hover:text-slate-700"
                              >
                                <FiX />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteId(s._id);
                              }}
                              className="text-slate-400 hover:text-rose-500 transition-colors"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-0 border-t border-slate-100 bg-slate-50/50">
                      <div className="mt-4 mb-4">
                          <div className="flex justify-between text-sm text-slate-600 mb-1">
                            <span>Attendance Progress</span>
                            <span className="font-medium">{s.attendedClasses} / {s.totalClasses} Classes</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${progressColor} transition-all duration-500 ease-out`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                      </div>

                      {/* Mark Buttons */}
                      <div className="flex gap-3 mb-6">
                        <button
                          onClick={() => markAttendance(s._id, "Present")}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition shadow-sm"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => markAttendance(s._id, "Absent")}
                          className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition shadow-sm"
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => markAttendance(s._id, "Undo")}
                          className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition"
                        >
                          Undo
                        </button>
                      </div>

                      {/* History */}
                      <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent History</p>
                          <div className="flex gap-2">
                            {recentHistory.length === 0 ? (
                              <span className="text-sm text-slate-400 italic">No attendance marked yet</span>
                            ) : (
                              recentHistory.map((h, i) => (
                                <div
                                  key={i}
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold shadow-sm border border-black/5 ${
                                    h.status === "Present"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : h.status === "Absent"
                                      ? "bg-rose-100 text-rose-700"
                                      : "bg-slate-100 text-slate-500"
                                  }`}
                                  title={new Date(h.date).toLocaleDateString()}
                                >
                                  {h.status[0]}
                                </div>
                              ))
                            )}
                          </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
