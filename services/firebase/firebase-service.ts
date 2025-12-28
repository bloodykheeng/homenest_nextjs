import axiosAPI from "../axiosApi";

export async function saveFirebaseToken(data: any) {
  const response = await axiosAPI.post(`saveFirebaseToken`, data);
  return response;
}


