import { proxy } from "valtio";

export const appStore = proxy({
  subtitle: "Reusable Next.js scaffold (Tailwind v4 + Catppuccin + Valtio).",
  counter: 0,
  isUtilityPanelOpen: false,
});

