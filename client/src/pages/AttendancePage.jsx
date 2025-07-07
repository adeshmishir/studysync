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
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/notes")}
            className="text-indigo-600 text-2xl hover:text-indigo-800"
            title="Back to Dashboard"
          >
            <FiArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-indigo-700">📊 Attendance Tracker</h1>
        </div>

        {/* Add Subject */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Add a new subject"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={addSubject}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center gap-2"
          >
            <FiPlus /> Add
          </button>
        </div>

        {/* Subjects */}
        {subjects.map((s) => {
          const percentage = s.totalClasses
            ? Math.round((s.attendedClasses / s.totalClasses) * 100)
            : 0;
          const progressColor = percentage >= 75 ? "bg-green-500" : "bg-red-500";
          const recentHistory = [...s.history].reverse().slice(0, 5);
          const isExpanded = expanded[s._id] || false;

          return (
            <div
              key={s._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              {/* Subject Row */}
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => setExpanded((prev) => ({ ...prev, [s._id]: !prev[s._id] }))}
              >
                {editingId === s._id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border p-1 rounded flex-1"
                    />
                    <button onClick={() => updateSubject(s._id)} className="text-green-600">
                      <FiCheck />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-gray-500">
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-indigo-700">{s.subject}</h2>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(s._id);
                          setEditName(s.subject);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit3 />
                      </button>
                      {confirmDeleteId === s._id ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSubject(s._id);
                            }}
                            className="text-red-600"
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(null);
                            }}
                            className="text-gray-500"
                          >
                            <FiX />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(s._id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-gray-600 mt-1">
                    {s.attendedClasses}/{s.totalClasses} classes attended
                  </p>

                  <div className="w-full bg-gray-200 h-2 rounded mt-1 mb-2">
                    <div
                      className={`h-2 ${progressColor} rounded`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>

                  <p className="text-sm font-medium mb-3">
                    Attendance: {percentage}%
                  </p>

                  {/* Mark Buttons */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => markAttendance(s._id, "Present")}
                      className="px-3 py-1 bg-green-600 text-white rounded-md"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => markAttendance(s._id, "Absent")}
                      className="px-3 py-1 bg-red-600 text-white rounded-md"
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => markAttendance(s._id, "Undo")}
                      className="px-3 py-1 bg-gray-400 text-white rounded-md"
                    >
                      Undo
                    </button>
                  </div>

                  {/* History */}
                  <p className="text-sm text-gray-600 mb-1">🕒 Last 5 Records:</p>
                  <div className="flex gap-2">
                    {recentHistory.length === 0 ? (
                      <span className="text-xs text-gray-400">No history</span>
                    ) : (
                      recentHistory.map((h, i) => (
                        <span
                          key={i}
                          className={`w-6 h-6 text-xs flex items-center justify-center rounded-full text-white ${
                            h.status === "Present"
                              ? "bg-green-500"
                              : h.status === "Absent"
                              ? "bg-red-500"
                              : "bg-gray-400"
                          }`}
                        >
                          {h.status[0]}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendancePage;
