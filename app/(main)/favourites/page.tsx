import { Metadata } from "next";
import Favourites from "@/components/market-place/Favourites";

export const metadata: Metadata = {
    title: "Favourites | HomeNest",
    description: "Your saved favourite products — HomeNest",
};

const FavouritesPage = () => {
    return <Favourites />;
};

export default FavouritesPage;
