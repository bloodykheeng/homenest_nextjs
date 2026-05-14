import { Metadata } from "next";
import ProfileViewPage from "@/components/market-place/Profile";

export const metadata: Metadata = {
    title: "My Profile | HomeNest",
    description: "View your HomeNest account profile.",
};

const Page = () => {
    return (
        <main>
            <ProfileViewPage />
        </main>
    );
};

export default Page;
