import { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    status: "",
    from: "",
    to: "",
  });

  const [form, setForm] = useState({
    company_name: "",
    job_title: "",
    application_date: "",
    status: "",
    notes: "",
  });

  useEffect(() => {
    fetchAllApps(); // show everything by default
  }, []);

  const fetchAllApps = async () => {
    try {
      const res = await axios.get("/applications/get");
      setApplications(res.data.data);
    } catch (err) {
      toast.error("Failed to load applications");
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams).toString();

    try {
      const res = await axios.get(`/applications/search?${params}`);
      setApplications(res.data.data);
    } catch (err) {
      toast.error("Search failed");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/applications/create", form);
      toast.success("Application added!");
      setApplications([res.data.data, ...applications]);
      setShowForm(false);
      setForm({
        company_name: "",
        job_title: "",
        application_date: "",
        status: "",
        notes: "",
      });
    } catch (err) {
      toast.error("Failed to create application");
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Job Applications</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + New Application
        </button>
      </div>

      {/* 🔍 SEARCH FORM */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-4 rounded shadow mb-4 flex flex-col md:flex-row gap-4"
      >
        <input
          type="text"
          placeholder="Keyword..."
          value={searchParams.keyword}
          onChange={(e) =>
            setSearchParams({ ...searchParams, keyword: e.target.value })
          }
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
        <select
          value={searchParams.status}
          onChange={(e) =>
            setSearchParams({ ...searchParams, status: e.target.value })
          }
          className="border px-3 py-2 rounded w-full md:w-1/5"
        >
          <option value="">All Statuses</option>
          <option value="applied">Applied</option>
          <option value="interviewed">Interviewed</option>
          <option value="offered">Offered</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>
        <input
          type="date"
          value={searchParams.from}
          onChange={(e) =>
            setSearchParams({ ...searchParams, from: e.target.value })
          }
          className="border px-3 py-2 rounded w-full md:w-1/6"
        />
        <input
          type="date"
          value={searchParams.to}
          onChange={(e) =>
            setSearchParams({ ...searchParams, to: e.target.value })
          }
          className="border px-3 py-2 rounded w-full md:w-1/6"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-2">Job Title</th>
              <th className="p-2">Company</th>
              <th className="p-2">Status</th>
              <th className="p-2">Applied On</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t">
                <td className="p-2">{app.job_title}</td>
                <td className="p-2">{app.company_name}</td>
                <td className="p-2 capitalize">{app.status}</td>
                <td className="p-2">{app.application_date}</td>
                <td className="p-2">
                  <Link
                    to={`/applications/${app.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-6 rounded w-full max-w-md shadow"
          >
            <h3 className="text-xl font-bold mb-4">New Application</h3>

            <input
              name="company_name"
              placeholder="Company"
              required
              value={form.company_name}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              className="mb-2 w-full border px-3 py-2 rounded"
            />
            <input
              name="job_title"
              placeholder="Job Title"
              required
              value={form.job_title}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              className="mb-2 w-full border px-3 py-2 rounded"
            />
            <input
              name="application_date"
              type="date"
              required
              value={form.application_date}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              className="mb-2 w-full border px-3 py-2 rounded"
            />
            <input
              name="status"
              placeholder="Status"
              required
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              className="mb-2 w-full border px-3 py-2 rounded"
            />
            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, [e.target.name]: e.target.value })
              }
              className="mb-4 w-full border px-3 py-2 rounded"
            />

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default ApplicationsPage;
