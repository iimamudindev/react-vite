import api from "./api";

const API = "/users";

export const getUsers = async () => {
  const res = await api.get(API);
  return res.data;
};

export const createUser = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};
export const updateUser = async (id, data) => {
  const res = await api.put(`${API}/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`${API}/${id}`);
  return res.data;
};

export const changePassword = async (data) => {
  const res = await api.put(
    "/change-password",
    data
  );

  return res.data;
};
export const getActivityLogs = async () => {
  const res = await api.get("/activity-logs");
  return res.data;
};
