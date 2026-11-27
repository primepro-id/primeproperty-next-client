import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ["**/*.test.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@next/next/no-assign-module-variable": "off",
    },
  },
  // Existing compiler diagnostics remain visible while these components await refactoring.
  {
    files: [
      "src/app/(admin)/admin/agents/_components/agent-form.tsx",
      "src/app/(admin)/admin/properties/_components/filters/id-filter.tsx",
      "src/app/(admin)/admin/properties/_components/property-form/sections/images-section.tsx",
      "src/components/ui/carousel.tsx",
      "src/hooks/use-mobile.tsx",
    ],
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  {
    files: [
      "src/app/(admin)/admin/agents/_components/delete-agent-dialog.tsx",
      "src/app/(client)/properties/_components/fillters/search.tsx",
    ],
    rules: { "react-hooks/refs": "warn" },
  },
  {
    files: ["src/components/ui/sidebar.tsx"],
    rules: { "react-hooks/purity": "warn" },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@next/next/no-img-element": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "**/globe.tsx",
    ],
  },
];

export default eslintConfig;
