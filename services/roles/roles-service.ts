import axiosAPI from "../axiosApi";
export async function getAllRoles(params = {}) {
  const response = await axiosAPI.get("users-roles", { params: params });
  return response;
}

// latest
export async function getAllRolesAndModifiedPermissionsService(params = {}) {
  const response = await axiosAPI.get("roles-with-modified-permissions", {
    params: params
  });
  return response;
}

export async function syncPermissionToRoleService(data: any) {
  const response = await axiosAPI.post(`sync-permissions-to-role`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}
