import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import { serverFetchProductById } from "@/services/server/server-fetcher";
import ProductDetail from "@/components/market-place/ProductDetail";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    try {
        const res = await serverFetchProductById(id);
        const product = res?.data?.data;
        return {
            title: product?.name
                ? `${product.name} | HomeNest`
                : "Product | HomeNest",
            description: product?.description || "Shop quality home essentials at HomeNest.",
        };
    } catch {
        return { title: "Product | HomeNest" };
    }
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["product", id],
        queryFn: () => serverFetchProductById(id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductDetail id={id} />
        </HydrationBoundary>
    );
}
