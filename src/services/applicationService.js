import axiosInstance from "./axiosInstance";

export const getApplications = async () => {
  const response = await axiosInstance.get("/applications/get");
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await axiosInstance.get(`/applications/getById/${id}`);
  return response.data;
};

export const createApplication = async (applicationData) => {
  const response = await axiosInstance.post(
    "/applications/create",
    applicationData
  );
  return response.data;
};

export const updateApplication = async (id, applicationData) => {
  const response = await axiosInstance.put(
    `/applications/update/${id}`,
    applicationData
  );
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await axiosInstance.delete(`/applications/delete/${id}`);
  return response.data;
};

export const uploadFiles = async (id, files) => {
  const formData = new FormData();
  if (files.resume) formData.append("resume", files.resume);
  if (files.coverLetter) formData.append("cover_letter", files.coverLetter);

  const response = await axiosInstance.post(
    `/applications/${id}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
