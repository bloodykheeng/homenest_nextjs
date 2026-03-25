// ─── Shared Order Types ───────────────────────────────────────────────────────
// Single source of truth — import from here in both RowForm and
// ProductItemsTableSelector so TypeScript sees ONE type, not two.

export type OrderCategory = {
    id: number;
    name: string;
    photo_url?: string | null;
};

export type OrderSubcategory = {
    id: number;
    name: string;
    photo_url?: string | null;
};

export type OrderProduct = {
    id: number;
    name: string;
    sku?: string | null;
    photo_url?: string | null;
    price?: number | null;
};

export type OrderItem = {
    product_category_id: number;
    product_subcategory_id: number;
    product_id: number;
    category: OrderCategory;
    subcategory: OrderSubcategory;
    product: OrderProduct;
    product_name: string;
    product_sku?: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
};