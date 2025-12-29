import axiosAPI from "../axiosApi";

export async function saveFirebaseToken(data: any) {
  const response = await axiosAPI.post(`save-firebase-token`, data);
  return response;
}


