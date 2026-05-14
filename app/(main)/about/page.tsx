import { Metadata } from "next";
import AboutTabs from "./AboutTabs";

export const metadata: Metadata = {
    title: "About HomeNest - Your Home, Made Comfortable",
    description:
        "Learn about HomeNest — Uganda's trusted online destination for quality household essentials, home décor, and everyday comfort items. Discover our story, values, and commitment to customer happiness.",
    keywords: [
        "HomeNest",
        "Uganda home goods",
        "household essentials",
        "home décor Uganda",
        "online shopping Uganda",
        "furniture Uganda",
        "kitchen appliances",
        "bedroom accessories",
        "comfortable living",
        "home improvement",
    ],
    robots: "index, follow",
    openGraph: {
        title: "About HomeNest - Your Home, Made Comfortable",
        description:
            "HomeNest brings thousands of curated home products straight to your door at fair, transparent prices. Discover our story and values.",
        type: "website",
        url: "https://homenest.ug/about",
        siteName: "HomeNest",
    },
    twitter: {
        card: "summary_large_image",
        title: "About HomeNest - Your Home, Made Comfortable",
        description:
            "Uganda's trusted online destination for quality household essentials, home décor, and everyday comfort items.",
    },
};

const AboutPage = () => {
    return (
        <>
            <AboutTabs />
        </>
    );
};

export default AboutPage;
