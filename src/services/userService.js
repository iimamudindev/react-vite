import api from "./api";

const API = "/users";

export const getUsers = async () => {
  try {
    const res = await api.get(API);

    console.log("STATUS:", res.status);
    console.log("RESPONSE:", res.data);

    return res.data;
  } catch (err) {
    console.log("STATUS:", err.response?.status);
    console.log("BODY:", err.response?.data);
    console.log("TOKEN:", localStorage.getItem("token"));

    throw err;
  }
};
export const createUser = async (data) => {
  try {
    const res = await api.post("/users", data);

    console.log("CREATE SUCCESS:", res);

    return res.data;
  } catch (err) {

    console.log("CREATE ERROR:", err);

    console.log("STATUS:", err.response?.status);

    console.log("BODY:", err.response?.data);

    throw err;
  }
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