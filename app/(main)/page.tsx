import ScrollUp from "@/components/common/ScrollUp";
import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HURIS - Human Rights Integrated Information System",
  description:
    "An integrated system supporting complaint handling, research and education, and monitoring and inspection across all regional human rights commission offices.",
  keywords: [
    "HURIS",
    "Human Rights",
    "Complaint Handling",
    "Research and Education",
    "Monitoring and Inspection",
    "Human Rights Commission",
    "Case Management",
    "Governance Systems"
  ],
  robots: "index, follow",
};



export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
    </>
  );
}
