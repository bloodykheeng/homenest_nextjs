"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { usePrimeReactToast } from "./PrimeReactToastProvider";

interface FavouriteItem {
    id: number | string;
    name: string;
    price: number;
    discount?: number;
    product_attachments?: any[];
    [key: string]: any;
}

interface FavouritesContextType {
    favouriteItems: FavouriteItem[];
    favouriteCount: number;
    isFavourite: (id: number | string) => boolean;
    addToFavourites: (item: FavouriteItem) => void;
    removeFromFavourites: (id: number | string) => void;
    clearFavourites: () => void;
}

const STORAGE_KEY = "homenest_favourites";

const FavouritesContext = createContext<FavouritesContextType>({
    favouriteItems: [],
    favouriteCount: 0,
    isFavourite: () => false,
    addToFavourites: () => {},
    removeFromFavourites: () => {},
    clearFavourites: () => {},
});

export const useFavourites = () => useContext(FavouritesContext);

export const FavouritesProvider = ({ children }: { children: React.ReactNode }) => {
    const primeReactToast = usePrimeReactToast();

    const [favouriteItems, setFavouriteItems] = useState<FavouriteItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setFavouriteItems(JSON.parse(stored));
        } catch {
            // ignore parse errors
        }
        setHydrated(true);
    }, []);

    // Persist to localStorage whenever favourites change (after hydration)
    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favouriteItems));
        } catch {
            // ignore storage errors
        }
    }, [favouriteItems, hydrated]);

    const isFavourite = useCallback(
        (id: number | string) => favouriteItems.some((item) => item.id === id),
        [favouriteItems]
    );

    const addToFavourites = useCallback(
        (item: FavouriteItem) => {
            if (favouriteItems.some((i) => i.id === item.id)) {
                primeReactToast.warn(`${item.name} is already in your favourites.`);
                return;
            }
            primeReactToast.success(`${item.name} added to favourites!`);
            setFavouriteItems((prev) => [...prev, item]);
        },
        [favouriteItems, primeReactToast]
    );

    const removeFromFavourites = useCallback(
        (id: number | string) => {
            const item = favouriteItems.find((i) => i.id === id);
            if (item) primeReactToast.success(`${item.name} removed from favourites.`);
            setFavouriteItems((prev) => prev.filter((i) => i.id !== id));
        },
        [favouriteItems, primeReactToast]
    );

    const clearFavourites = useCallback(() => {
        setFavouriteItems([]);
    }, []);

    const favouriteCount = useMemo(() => favouriteItems.length, [favouriteItems]);

    return (
        <FavouritesContext.Provider
            value={{
                favouriteItems,
                favouriteCount,
                isFavourite,
                addToFavourites,
                removeFromFavourites,
                clearFavourites,
            }}
        >
            {children}
        </FavouritesContext.Provider>
    );
};

export default useFavourites;
