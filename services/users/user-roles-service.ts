import axiosAPI from "../axiosApi";

export async function getAllUserAssignableRoles(params = {}) {
  const response = await axiosAPI.get("roles", { params: params });
  return response;
}
