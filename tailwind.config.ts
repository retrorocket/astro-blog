import type { Config } from "tailwindcss";
import theme from "./src/config/theme.json";

let font_base = Number(theme.fonts.font_size.base.replace("px", ""));
let font_scale = Number(theme.fonts.font_size.scale);
let h6 = font_base / font_base;
let h5 = h6 * font_scale;
let h4 = h5 * font_scale;
let h3 = h4 * font_scale;
let h2 = h3 * font_scale;
let h1 = h2 * font_scale;

const fontPrimary = theme.fonts.font_family.primary
  .replace(/\+/g, " ")
  .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
const fontPrimaryType = theme.fonts.font_family.primary_type;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "media",
  theme: {
    screens: {
      xs: "375px",
      sm: "540px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        text: theme.colors.default.text_color.default,
        light: theme.colors.default.text_color.light,
        dark: theme.colors.default.text_color.dark,
        primary: theme.colors.default.theme_color.primary,
        secondary: theme.colors.default.theme_color.secondary,
        body: theme.colors.default.theme_color.body,
        border: theme.colors.default.theme_color.border,
        "border-dark": theme.colors.default.theme_color.border_dark,
        "theme-light": theme.colors.default.theme_color.theme_light,
        "theme-dark": theme.colors.default.theme_color.theme_dark,
        "text-dark": theme.colors.default.text_color.text_dark,
        "primary-dark": theme.colors.default.theme_color.primary_dark,
        "secondary-dark": theme.colors.default.text_color.dark_secondary,
      },
      fontSize: {
        base: font_base + "px",
        h1: h1 + "rem",
        "h1-sm": h1 * 0.8 + "rem",
        h2: h2 + "rem",
        "h2-sm": h2 * 0.8 + "rem",
        h3: h3 + "rem",
        "h3-sm": h3 * 0.8 + "rem",
        h4: h4 + "rem",
        h5: h5 + "rem",
        h6: h6 + "rem",
      },
      fontFamily: {
        primary: [fontPrimary, fontPrimaryType],
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            code: {
              backgroundColor: theme("colors.primary/15%"),
              borderRadius: theme("borderRadius.DEFAULT"),
              paddingTop: theme("spacing.[0.5]"),
              paddingBottom: theme("spacing.[0.5]"),
              paddingLeft: theme("spacing.[1.5]"),
              paddingRight: theme("spacing.[1.5]"),
              fontWeight: "normal",
            },
            "code::before": {
              content: "none",
            },
            "code::after": {
              content: "none",
            },
          },
        },
        invert: {
          css: {
            ":not(pre) > code": {
              backgroundColor: theme("colors.zinc.700"),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-bootstrap-grid")({ generateContainer: false }),
  ],
} satisfies Config;
