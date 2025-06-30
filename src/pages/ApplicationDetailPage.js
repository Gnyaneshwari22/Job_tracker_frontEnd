import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../services/axiosInstance";
import Layout from "../components/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [files, setFiles] = useState({ resume: null, cover_letter: null });
  const [reminder, setReminder] = useState({ date: "", message: "" });

  const [form, setForm] = useState({
    job_title: "",
    company_name: "",
    status: "",
    application_date: "",
    notes: "",
  });

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await axios.get(`/applications/getById/${id}`);
        setApp(res.data.data);
        setForm({
          job_title: res.data.data.job_title,
          company_name: res.data.data.company_name,
          status: res.data.data.status,
          application_date: res.data.data.application_date?.slice(0, 10),
          notes: res.data.data.notes || "",
        });
      } catch (err) {
        console.error("Fetch app error:", err);
      }
    };

    const fetchNotes = async () => {
      try {
        const res = await axios.get(`/applications/${id}/notes`);
        setNotes(res.data.data);
      } catch (err) {
        console.error("Fetch notes error:", err);
      }
    };

    fetchApp();
    fetchNotes();
  }, [id]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/applications/update/${id}`, form);
      toast.success("Application updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;
    try {
      await axios.delete(`/applications/delete/${id}`);
      toast.success("Deleted successfully");
      setTimeout(() => navigate("/applications"), 1000);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({ ...prev, [name]: files[0] }));
  };

  // const handleUpload = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   if (files.resume) formData.append("resume", files.resume);
  //   if (files.cover_letter) formData.append("cover_letter", files.cover_letter);
  //   try {
  //     let { data } = await axios.post(`/applications/${id}/upload`, formData);
  //     console.log("Resume URL:", data.data.resume);
  //     console.log("Cover URL:", data.data.cover_letter);
  //     toast.success("Files uploaded");
  //   } catch (err) {
  //     toast.error("Upload failed");
  //   }
  // };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (files.resume) formData.append("resume", files.resume);
    if (files.cover_letter) formData.append("cover_letter", files.cover_letter);

    try {
      let { data } = await axios.post(`/applications/${id}/upload`, formData);
      toast.success("Files uploaded");
      console.log("Resume URL:", data.data.resume);
      console.log("Cover URL:", data.data.cover_letter);

      // ✅ re-fetch updated application data
      const updated = await axios.get(`/applications/getById/${id}`);
      setApp(updated.data.data);

      // Optionally clear inputs
      setFiles({ resume: null, cover_letter: null });
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error("Note cannot be empty");
      return;
    }
    try {
      const res = await axios.post(`/applications/${id}/notes`, {
        content: newNote,
      });
      setNotes([...notes, res.data.data]);
      setNewNote("");
      toast.success("Note added");
    } catch (err) {
      toast.error("Failed to add note");
    }
  };

  if (!app)
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );

  return (
    <Layout>
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Application Detail</h2>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Left Column */}
        <div className="w-full md:w-3/5 space-y-6">
          {/* Application Form */}
          <form
            onSubmit={handleUpdate}
            className="bg-white p-4 rounded shadow space-y-4"
          >
            <input
              name="job_title"
              placeholder="Job Title"
              value={form.job_title}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="company_name"
              placeholder="Company"
              value={form.company_name}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
            />
            <label className="block font-semibold mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select status</option>
              <option value="applied">Applied</option>
              <option value="interviewed">Interviewed</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
            <input
              name="application_date"
              type="date"
              value={form.application_date}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
            />
            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </form>

          {/* File Upload Form */}
          <form onSubmit={handleUpload} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">
              Upload Resume & Cover Letter
            </h3>

            {/* File Upload Inputs */}
            <input
              type="file"
              name="resume"
              onChange={handleFileChange}
              className="mb-3 block w-full border rounded px-3 py-2"
            />
            <input
              type="file"
              name="cover_letter"
              onChange={handleFileChange}
              className="mb-4 block w-full border rounded px-3 py-2"
            />

            {/* Download Links */}
            {(app.resume_file_path || app.cover_letter_file_path) && (
              <div className="bg-gray-50 p-3 rounded mb-4 border text-sm">
                <h4 className="font-medium mb-2 text-gray-700">
                  📁 Previously Uploaded:
                </h4>
                <ul className="space-y-1 ml-2 text-blue-600 list-disc">
                  {app.resume_file_path && (
                    <li>
                      <a
                        href={app.resume_file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        Resume
                      </a>
                    </li>
                  )}
                  {app.cover_letter_file_path && (
                    <li>
                      <a
                        href={app.cover_letter_file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        Cover Letter
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
            >
              Upload Files
            </button>
          </form>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-2/5">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Set a Reminder</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await axios.post("/reminders/create", {
                    job_application_id: app.id,
                    reminder_date: reminder.date,
                    message: reminder.message,
                  });
                  toast.success("Reminder set!");
                  setReminder({ date: "", message: "" });
                } catch (err) {
                  toast.error("Failed to set reminder");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Reminder Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={reminder.date}
                  onChange={(e) =>
                    setReminder({ ...reminder, date: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  value={reminder.message}
                  onChange={(e) =>
                    setReminder({ ...reminder, message: e.target.value })
                  }
                  rows={3}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Set Reminder
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Downloads */}

      {/* Notes Section */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Application Notes</h3>
        {notes.length ? (
          <ul className="list-disc ml-6 mb-4">
            {notes.map((note) => (
              <li key={note.id} className="mb-1">
                {note.content}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4">No notes yet.</p>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAddNote}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Note
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationDetailPage;
