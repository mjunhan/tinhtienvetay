import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--color-background)",
                foreground: "var(--color-text-body)",
                primary: {
                    DEFAULT: "var(--color-primary)",
                    hover: "var(--color-primary-hover)",
                    dark: "var(--color-primary-dark)",
                },
                secondary: "var(--color-secondary)",
                surface: "var(--color-surface)",
                text: {
                    main: "var(--color-text-main)",
                    body: "var(--color-text-body)",
                    muted: "var(--color-text-muted)",
                }
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
    ],
};
export default config;
