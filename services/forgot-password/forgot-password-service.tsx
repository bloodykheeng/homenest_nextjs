import axiosAPI from "../axiosApi";

export async function postToPasswordGetOtp(data: any) {
  const response = await axiosAPI.post(`password-get-otp`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
}

export async function postToPasswordValidateOtp(data: any) {
  const response = await axiosAPI.post(`password-validate-otp`, data);
  return response;
}

export async function postToPasswordResetWithOtp(data: any) {
  const response = await axiosAPI.post(`password-reset-with-otp`, data);
  return response;
}
