import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import remarkFigureCaption from "@microflash/remark-figure-caption";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import config from "./src/config/config.json";
import sitemap from "./src/integrations/sitemap";
import createOgImage from "./src/integrations/og-image";
import algoliaQueries from "./src/integrations/algolia-queries";

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "https://retrorocket.biz",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  integrations: [
    createOgImage(),
    algoliaQueries(),
    react(),
    sitemap(),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    AutoImport({
      imports: [
        "@shortcodes/Button",
        "@shortcodes/Accordion",
        "@shortcodes/Notice",
      ],
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [
      remarkFigureCaption,
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-toc",
        {
          customizeTOC: (toc) => {
            if (!toc.children.some((child) => child.children.length > 0)) {
              toc.properties.className = `${toc.properties.className} hidden`;
            }
            return toc;
          },
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
