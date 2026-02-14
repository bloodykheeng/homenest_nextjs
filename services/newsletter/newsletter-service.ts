import axiosAPI from "../axiosApi";

// ─── Subscribe To Newsletter ─────────────────────────────────────────────
export async function postNewsletterSubscription(data: any) {
    const response = await axiosAPI.post("newsletter-subscriptions", data);
    return response;
}
