import { proxy } from "valtio";

export const appStore = proxy({
  subtitle: "Reusable Next.js scaffold (Tailwind v4 + Catppuccin + Valtio).",
  counter: 0,
  isUtilityPanelOpen: false,
  isSettingsOpen: false,
  projectName: "Slopdog Vanilla",
  repositoryUrl: "https://github.com",
  appInfoUrl: "",
  orientationVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
});

