import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "../services/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    job_title: "",
    industry: "",
    company_size: "",
    contact_email: "",
    phone_number: "",
    location: "",
    job_link: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/companies");
      setCompanies(res.data.data);
    } catch (err) {
      console.error("Failed to load companies:", err);
      toast.error("Failed to load companies");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/companies/${editingId}`, form);
        toast.success("Company updated!");
      } else {
        const res = await axios.post("/companies", form);
        setCompanies([res.data.data, ...companies]);
        toast.success("Company added!");
      }
      resetForm();
      fetchCompanies(); // Refresh the list
    } catch (err) {
      toast.error(`Failed to ${editingId ? "update" : "add"} company`);
    }
  };

  const handleEdit = (company) => {
    setForm({
      company_name: company.company_name,
      contact_name: company.contact_name,
      job_title: company.job_title,
      industry: company.industry,
      company_size: company.company_size,
      contact_email: company.contact_email,
      phone_number: company.phone_number,
      location: company.location,
      job_link: company.job_link,
      notes: company.notes,
    });
    setEditingId(company.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;

    try {
      await axios.delete(`/companies/${id}`);
      toast.success("Company deleted!");
      setCompanies(companies.filter((company) => company.id !== id));
    } catch (err) {
      toast.error("Failed to delete company");
    }
  };

  const resetForm = () => {
    setForm({
      company_name: "",
      contact_name: "",
      job_title: "",
      industry: "",
      company_size: "",
      contact_email: "",
      phone_number: "",
      location: "",
      job_link: "",
      notes: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Companies To Contact</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + New Company
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="table-auto w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-2">Company</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Job Title</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Location</th>
              <th className="p-2">Industry</th>
              <th className="p-2">Size</th>
              <th className="p-2">Job Link</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{company.company_name}</td>
                <td className="p-2">{company.contact_name}</td>
                <td className="p-2">{company.job_title}</td>
                <td className="p-2">{company.contact_email}</td>
                <td className="p-2">{company.phone_number}</td>
                <td className="p-2">{company.location}</td>
                <td className="p-2">{company.industry}</td>
                <td className="p-2">{company.company_size}</td>
                <td className="p-2">
                  {company.job_link ? (
                    <a
                      href={company.job_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2 space-x-1 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(company)}
                    className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    title="Edit"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
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
            {companies.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center text-gray-500 p-4">
                  No companies yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded w-full max-w-lg shadow max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold mb-4">
              {editingId ? "Edit Company" : "New Company"}
            </h3>

            {[
              "company_name",
              "contact_name",
              "job_title",
              "industry",
              "company_size",
              "contact_email",
              "phone_number",
              "location",
              "job_link",
              "notes",
            ].map((field) => (
              <div key={field} className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </label>
                {field === "notes" ? (
                  <textarea
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    rows={3}
                  />
                ) : (
                  <input
                    type={
                      field.includes("email")
                        ? "email"
                        : field.includes("phone")
                        ? "tel"
                        : "text"
                    }
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default CompaniesPage;
