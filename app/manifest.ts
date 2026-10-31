import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ORBIT",
    short_name: "Orbit",
    description: "Rotate. Share. Done.",
    start_url: "/",
    display: "standalone",
    background_color: "#4f46e5",
    theme_color: "#4f46e5",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png" },
    ],
  };
}