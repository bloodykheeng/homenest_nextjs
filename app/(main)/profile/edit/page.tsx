import { Metadata } from "next";
import EditProfilePage from "@/components/market-place/Profile/EditProfile";

export const metadata: Metadata = {
    title: "Edit Profile | HomeNest",
    description: "Update your HomeNest account profile.",
};

const Page = () => {
    return (
        <main>
            <EditProfilePage />
        </main>
    );
};

export default Page;
