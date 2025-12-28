import { Metadata } from "next";
import AboutTabs from "./AboutTabs";

export const metadata: Metadata = {
    title: "About HURIS - Human Rights Integrated Information System",
    description:
        "Learn about the Uganda Human Rights Commission (UHRC) and HURIS - an integrated system supporting complaint handling, research and education, and monitoring and inspection across all regional human rights commission offices. Established under the 1995 Constitution of Uganda.",
    keywords: [
        "HURIS",
        "Human Rights",
        "Uganda Human Rights Commission",
        "UHRC",
        "Complaint Handling",
        "Research and Education",
        "Monitoring and Inspection",
        "Human Rights Commission",
        "Case Management",
        "Regional Offices",
        "Constitutional Mandate",
        "Human Rights Violations",
        "Detention Facilities",
        "Human Rights Protection",
        "Uganda Constitution",
        "Article 52",
        "Article 53",
        "Governance Systems"
    ],
    robots: "index, follow",
    openGraph: {
        title: "About HURIS - Human Rights Integrated Information System",
        description:
            "The Uganda Human Rights Commission (UHRC) operates HURIS to monitor human rights, investigate complaints, and ensure accountability across Uganda's 9 regional and 7 field offices.",
        type: "website",
        url: "https://huris.ug/about",
        siteName: "HURIS",
    },
    twitter: {
        card: "summary_large_image",
        title: "About HURIS - Human Rights Integrated Information System",
        description:
            "HURIS supports the Uganda Human Rights Commission in complaint handling, research and education, and monitoring and inspection across all regions.",
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