const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function serverFetch(endpoint: string, params: Record<string, any> = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.set(key, String(value));
        }
    });

    const qs = searchParams.toString();
    const url = `${baseURL}/${endpoint}${qs ? `?${qs}` : ""}`;

    const response = await fetch(url, {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error(`Server fetch failed: ${endpoint} (${response.status})`);

    const json = await response.json();
    // Mirror the axios response shape: query.data.data.data used by client components
    return { data: json };
}

export const serverFetchProducts = (params: Record<string, any> = {}) =>
    serverFetch("products", params);

export const serverFetchProductById = (id: string | number) =>
    serverFetch(`products/${id}`);

export const serverFetchProductCategories = (params: Record<string, any> = {}) =>
    serverFetch("product-categories", params);
