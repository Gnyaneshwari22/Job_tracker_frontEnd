import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "../services/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    company_id: "",
    job_title: "",
    job_url: "",
    notes: "",
  });

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/saved-jobs");
      setSavedJobs(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch saved jobs");
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/companies");
      setCompanies(res.data.data);
    } catch (err) {
      toast.error("Failed to load companies");
    }
  };

  const handleChange = (e) => {
    //setForm({ ...form, [e.target.name]: e.target.value });
    const { name, value } = e.target;

    // 🧼 Sanitize job_url specifically
    const cleanedValue =
      name === "job_url"
        ? value.trim().replace(/[\u200B-\u200D\uFEFF]/g, "")
        : value;

    setForm({ ...form, [name]: cleanedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/saved-jobs", form);
      toast.success("Job saved");
      fetchJobs();
      resetForm();
    } catch (err) {
      toast.error("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this saved job?")) return;
    try {
      await axios.delete(`/saved-jobs/${id}`);
      toast.success("Deleted");
      setSavedJobs(savedJobs.filter((job) => job.id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setForm({
      company_id: "",
      job_title: "",
      job_url: "",
      notes: "",
    });
    setShowForm(false);
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Saved Jobs</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Save Job
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="table-auto w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-2">Job Title</th>
              <th className="p-2">Company</th>
              <th className="p-2">Link</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedJobs.map((job) => (
              <tr key={job.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{job.job_title}</td>
                <td className="p-2">
                  {companies.find((c) => c.id === job.company_id)
                    ?.company_name || "Unknown"}
                </td>
                <td className="p-2">
                  {job.job_url ? (
                    <a
                      href={job.job_url}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2">{job.notes || "-"}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {savedJobs.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No saved jobs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Save a Job</h3>

            <label className="block mb-2 font-medium">Company</label>
            <select
              name="company_id"
              value={form.company_id}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 mb-4 rounded"
            >
              <option value="">Select company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_name}
                </option>
              ))}
            </select>
            <p className="text-sm mt-1 mb-4">
              Don't see the company?{" "}
              <a href="/companies" className="text-blue-600 underline">
                Add a new one
              </a>
            </p>

            <input
              name="job_title"
              placeholder="Job Title"
              value={form.job_title}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 mb-4 rounded"
            />
            <input
              name="job_url"
              placeholder="Job URL"
              value={form.job_url}
              onChange={handleChange}
              className="w-full border px-3 py-2 mb-4 rounded"
            />
            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border px-3 py-2 mb-4 rounded"
            />

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default SavedJobsPage;
