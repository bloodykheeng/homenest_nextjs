import axiosAPI from "../../axiosApi";

export async function getAllChannels(params = {}) {
  const response = await axiosAPI.get("channels", { params });
  return response;
}

export async function getChannelById(id: any) {
  const response = await axiosAPI.get(`channels/${id}`);
  return response;
}

export async function postChannel(data: any) {
  const response = await axiosAPI.post("channels", data);
  return response;
}

export async function updateChannel(id: any, data: any) {
  const response = await axiosAPI.put(`channels/${id}`, data);
  return response;
}

export async function deleteChannelById(id: any) {
  const response = await axiosAPI.delete(`channels/${id}`);
  return response;
}

export async function postToBulkDestroyChannels(data: any) {
  const response = await axiosAPI.post("bulk-destroy-channels", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}
