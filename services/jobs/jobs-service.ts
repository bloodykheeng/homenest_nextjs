import axiosAPI from "../axiosApi";

export async function getAllJobs(params = {}) {
    const response = await axiosAPI.get("jobs", { params: params });
    return response;
}

export async function getAllFailedJobs(params = {}) {
    const response = await axiosAPI.get("failed-jobs", { params: params });
    return response;
}

export async function getAllJobStats(params = {}) {
    const response = await axiosAPI.get("job-stats", { params: params });
    return response;
}



export async function postToBulkDestroyJobs(data: any) {
    const response = await axiosAPI.post(`bulk-destroy-jobs`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}

export async function postToBulkDestroyFailedJobs(data: any) {
    const response = await axiosAPI.post(`bulk-destroy-failed-jobs`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
}