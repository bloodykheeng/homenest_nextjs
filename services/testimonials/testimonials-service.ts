import axiosAPI from "../axiosApi";

// ─── Get All Testimonials ────────────────────────────────────────────────
export async function getAllTestimonials(params: any = {}) {
    const response = await axiosAPI.get("testimonials", {
        params: params,
    });
    return response;
}

// ─── Get Testimonial By ID ───────────────────────────────────────────────
export async function getTestimonialById(id: any) {
    const response = await axiosAPI.get(`testimonials/` + id);
    return response;
}

// ─── Create Testimonial ──────────────────────────────────────────────────
export async function postTestimonial(data: any) {
    const response = await axiosAPI.post("testimonials", data);
    return response;
}

// ─── Update Testimonial ──────────────────────────────────────────────────
export async function updateTestimonial(id: any, data: any) {
    const response = await axiosAPI.put(`testimonials/${id}`, data);
    return response;
}

// ─── Delete Testimonial ──────────────────────────────────────────────────
export async function deleteTestimonialById(id: any) {
    const response = await axiosAPI.delete(`testimonials/${id}`);
    return response;
}
