import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AfriKlang — Pont d’apprentissage",
    short_name: "AfriKlang",
    description:
      "De la langue que l’enfant connaît vers la langue de l’école (gungbe → français).",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff8ec",
    theme_color: "#f59e0b",
    lang: "fr",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
