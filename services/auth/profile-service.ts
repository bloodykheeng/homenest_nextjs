import axiosAPI from "../axiosApi";

export async function updateUserProfile(data: FormData) {
    const response = await axiosAPI.post("/postToUpdateUserProfile", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}
