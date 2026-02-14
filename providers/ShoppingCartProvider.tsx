"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
} from "react";
import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { usePrimeReactToast } from "./PrimeReactToastProvider";
import useAuthContext from "./AuthProvider";
import useHandleQueryError from "@/hooks/useHandleQueryError";
import {
    getAllCarts,
    postCart,
    updateCart,
    deleteCartById,
    postToSyncCart,
} from "@/services/shopping-cart/shopping-cart-service";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartItem {
    id: number | string;
    name: string;
    price: number;
    discount?: number;
    quantity: number; // available stock
    selected_quantity: number;
    product_attachments?: any[];
    [key: string]: any;
}

interface CartPayload {
    user_id: number | string;
    product_id: number | string;
    selected_quantity: number;
    price: number;
}

interface SyncCartPayload {
    carts: {
        product_id: number | string;
        selected_quantity: number;
        price: number;
    }[];
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    cartTotal: number;
    isCartLoading: boolean;
    isSyncing: boolean;
    addToCart: (item: CartItem) => void;
    updateCartItemQuantity: (id: number | string, quantity: number) => void;
    removeFromCart: (id: number | string) => void;
    clearCart: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ShoppingCartContext = createContext<CartContextType>({
    cartItems: [],
    cartCount: 0,
    cartTotal: 0,
    isCartLoading: false,
    isSyncing: false,
    addToCart: () => { },
    updateCartItemQuantity: () => { },
    removeFromCart: () => { },
    clearCart: () => { },
});

export const useShoppingCart = () => useContext(ShoppingCartContext);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ShoppingCartProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const primeReactToast = usePrimeReactToast();
    const queryClient = useQueryClient();
    const { getUserQuery } = useAuthContext();

    const loggedInUser = getUserQuery?.data?.data;
    const isLoggedIn = !!loggedInUser?.id;

    // ── Local cart state ──────────────────────────────────────────────────────
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // ── Ref to read current cartItems outside of setState updaters ─────────
    const cartItemsRef = useRef<CartItem[]>([]);
    useEffect(() => {
        cartItemsRef.current = cartItems;
    }, [cartItems]);

    // ── Fetch server cart when logged in ──────────────────────────────────────
    const getCartQuery = useQuery({
        enabled: isLoggedIn,
        queryKey: ["cart", loggedInUser?.id],
        queryFn: () => getAllCarts({ user_id: loggedInUser?.id }),
    });

    useHandleQueryError(getCartQuery);

    // Hydrate local state from server when data arrives
    useEffect(() => {
        if (getCartQuery?.data?.data?.data && isLoggedIn) {
            setCartItems(getCartQuery.data.data.data);
        }
    }, [getCartQuery?.data?.data?.data, isLoggedIn]);

    // ── Mutations ─────────────────────────────────────────────────────────────

    const postCartMutation = useMutation<unknown, unknown, CartPayload>({
        mutationFn: postCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error) => {
            console.error("Error adding to cart:", error);
            primeReactToast.error("Failed to add item to cart.");
        },
    });

    const updateCartMutation = useMutation<unknown, unknown, CartPayload>({
        mutationFn: (variables) => updateCart(variables.product_id, variables),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error) => {
            console.error("Error updating cart:", error);
            primeReactToast.error("Failed to update cart.");
        },
    });

    const deleteCartMutation = useMutation<unknown, unknown, number | string>({
        mutationFn: deleteCartById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error) => {
            console.error("Error removing from cart:", error);
            primeReactToast.error("Failed to remove item from cart.");
        },
    });

    const syncCartMutation = useMutation<unknown, unknown, SyncCartPayload>({
        mutationFn: postToSyncCart,
        onSuccess: (response: any) => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            if (response?.data?.data) {
                setCartItems(response.data.data);
            }
        },
        onError: (error) => {
            console.error("Error syncing cart:", error);
            primeReactToast.error("Failed to sync cart.");
        },
    });

    // ── Sync local cart to server on login ────────────────────────────────────
    useEffect(() => {
        if (!isLoggedIn) return;
        if (!cartItems.length) return;
        if (getCartQuery?.data) return;

        const organizedItems = cartItems.map((item) => ({
            product_id: item.id,
            selected_quantity: item.selected_quantity,
            price: item.price,
        }));

        syncCartMutation.mutate({ carts: organizedItems });
    }, [isLoggedIn, cartItems, getCartQuery?.data]);

    // ── Clear cart on logout ──────────────────────────────────────────────────
    useEffect(() => {
        if (!isLoggedIn && !getUserQuery?.isLoading) {
            // Keep local cart items for guest users, but clear server-synced data
        }
    }, [isLoggedIn, getUserQuery?.isLoading]);

    // ── Cart actions (toasts OUTSIDE setState updaters) ───────────────────────

    const addToCart = useCallback(
        (item: CartItem) => {
            const prevItems = cartItemsRef.current;
            const existingItem = prevItems.find((i) => i.id === item.id);

            if (existingItem) {
                const newQuantity =
                    existingItem.selected_quantity + (item.selected_quantity || 1);

                if (newQuantity > item.quantity) {
                    primeReactToast.warn(
                        `Cannot add more than the available stock of ${item.name}!`
                    );
                    return;
                }

                primeReactToast.success(`${item.name} quantity updated!`);

                if (isLoggedIn) {
                    updateCartMutation.mutate({
                        user_id: loggedInUser.id,
                        product_id: item.id,
                        selected_quantity: newQuantity,
                        price: item.price,
                    });
                }

                setCartItems(
                    prevItems.map((i) =>
                        i.id === item.id
                            ? { ...i, selected_quantity: newQuantity }
                            : i
                    )
                );
            } else {
                primeReactToast.success(`${item.name} added to cart!`);

                if (isLoggedIn) {
                    postCartMutation.mutate({
                        user_id: loggedInUser.id,
                        product_id: item.id,
                        selected_quantity: item.selected_quantity || 1,
                        price: item.price,
                    });
                }

                setCartItems([
                    ...prevItems,
                    {
                        ...item,
                        selected_quantity: item.selected_quantity || 1,
                    },
                ]);
            }
        },
        [isLoggedIn, loggedInUser?.id, primeReactToast, updateCartMutation, postCartMutation]
    );

    const updateCartItemQuantity = useCallback(
        (id: number | string, quantity: number) => {
            const prevItems = cartItemsRef.current;
            const item = prevItems.find((i) => i.id === id);
            if (!item) return;

            if (quantity > item.quantity) {
                primeReactToast.warn(
                    `Cannot exceed available stock of ${item.name}!`
                );
                return;
            }

            if (quantity < 1) return;

            if (isLoggedIn) {
                updateCartMutation.mutate({
                    user_id: loggedInUser.id,
                    product_id: id,
                    selected_quantity: quantity,
                    price: item.price,
                });
            }

            setCartItems(
                prevItems.map((i) =>
                    i.id === id ? { ...i, selected_quantity: quantity } : i
                )
            );
        },
        [isLoggedIn, loggedInUser?.id, primeReactToast, updateCartMutation]
    );

    const removeFromCart = useCallback(
        (id: number | string) => {
            const prevItems = cartItemsRef.current;
            const itemToRemove = prevItems.find((i) => i.id === id);

            if (itemToRemove) {
                primeReactToast.success(
                    `${itemToRemove.name} removed from cart!`
                );

                if (isLoggedIn) {
                    deleteCartMutation.mutate(id);
                }
            }

            setCartItems(prevItems.filter((item) => item.id !== id));
        },
        [isLoggedIn, primeReactToast, deleteCartMutation]
    );

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    // ── Derived values ────────────────────────────────────────────────────────
    const cartCount = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.selected_quantity, 0),
        [cartItems]
    );

    const cartTotal = useMemo(
        () =>
            cartItems.reduce((sum, item) => {
                const discount = item.discount || 0;
                const finalPrice = item.price - (item.price * discount) / 100;
                return sum + finalPrice * item.selected_quantity;
            }, 0),
        [cartItems]
    );

    const isCartLoading = getCartQuery.isPending && isLoggedIn;

    const isSyncing = syncCartMutation.isPending;

    // ── Provider ──────────────────────────────────────────────────────────────
    return (
        <ShoppingCartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartTotal,
                isCartLoading,
                isSyncing,
                addToCart,
                updateCartItemQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </ShoppingCartContext.Provider>
    );
};

export default useShoppingCart;