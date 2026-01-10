import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default [
  // eslint-config-next ships as flat config in Next 16.1+
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    name: "slopdogrpg/config-overrides",
    files: ["**/*.config.*", "eslint.config.mjs", "postcss.config.mjs", "next.config.ts"],
    rules: {
      "import/no-anonymous-default-export": "off",
    },
  },
];

