import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const preset = Array.isArray(nextCoreWebVitals) ? nextCoreWebVitals : [nextCoreWebVitals];

const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "**/.impeccable/**", "**/.gemini/**"] },
  ...preset,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
