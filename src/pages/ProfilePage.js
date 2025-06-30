import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "../services/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [form, setForm] = useState({
    frstname: "",
    lastname: "",
    phone: "",
    skills: "",
    current_location: "",
    experience: "",
    portfolio_url: "",
    career_goals: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/profile");
        setForm(res.data.data);
      } catch (err) {
        toast.error("Profile not found");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/profile", form);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Your profile will be permanently deleted.Continue?"))
      return;
    try {
      await axios.delete("/profile");
      toast.success("Profile scheduled for deletion");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>

      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded shadow max-w-xl space-y-4"
      >
        {[
          "frstname",
          "lastname",
          "phone",
          "skills",
          "current_location",
          "experience",
          "portfolio_url",
          "career_goals",
        ].map((field) => (
          <div key={field}>
            <label className="block font-medium mb-1 capitalize">
              {field.replace(/_/g, " ")}
            </label>
            {field === "career_goals" ||
            field === "skills" ||
            field === "experience" ? (
              <textarea
                name={field}
                value={form[field]}
                onChange={handleChange}
                rows={3}
                className="w-full border px-3 py-2 rounded"
              />
            ) : (
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            )}
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete My Profile
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default ProfilePage;
