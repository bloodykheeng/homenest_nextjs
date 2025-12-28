"use client";
import { useEffect, useContext } from "react";

import { PrimeReactProvider } from "primereact/api";
import { PrimeReactContext } from "primereact/api";
import { useTheme } from "./ThemeProvider";

import Tailwind from "primereact/passthrough/tailwind";

function ThemeSync() {
  const { theme } = useTheme(); // Get theme from next-themes

  // console.log("🚀 ~ ThemeSync ~ theme:", theme)
  const { changeTheme } = useContext(PrimeReactContext);

  useEffect(() => {
    if (!theme || !changeTheme) return; // Avoid SSR issues

    const linkId = "theme-link";
    const newTheme = theme === "dark" ? "lara-dark-blue" : "lara-light-blue";
    const currentTheme =
      newTheme === "lara-dark-blue" ? "lara-light-blue" : "lara-dark-blue";

    changeTheme(currentTheme, newTheme, linkId, () => {
      const existingLinks = document.querySelectorAll(`link[id="${linkId}"]`);
      if (existingLinks.length > 1) {
        document.head.removeChild(existingLinks[0]); // Remove old theme link
      }
    });
  }, [theme, changeTheme]);

  return null;
}

export default function PrimeReactProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrimeReactProvider value={{ unstyled: false, pt: Tailwind }}>
      <ThemeSync />
      {children}
    </PrimeReactProvider>
  );
}

// To copy only lara-light-blue and lara-dark-blue from node_modules
// into your public/themes folder using PowerShell, follow these steps:
// -----------------------------------------------------------------------

// # Create destination directory if it doesn't exist
// New-Item -Path "public/themes" -ItemType Directory -Force

// # Copy lara-light-blue
// Copy-Item -Path "node_modules/primereact/resources/themes/lara-light-blue" -Destination "public/themes" -Recurse -Force

// # Copy lara-dark-blue
// Copy-Item -Path "node_modules/primereact/resources/themes/lara-dark-blue" -Destination "public/themes" -Recurse -Force

//================= copying react leaflet  ======================
// windows users running nextjs 15

//  New-Item -ItemType Directory -Path public\react-leaflet-images -Force
// Copy-Item -Path node_modules\leaflet\dist\images\* -Destination public\react-leaflet-images -Recurse -Force

// run those commands in terminal to copy the images to public folder
