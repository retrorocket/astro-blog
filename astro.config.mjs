import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import AutoImport from "astro-auto-import";
import { defineConfig, sharpImageService } from "astro/config";
import remarkFigureCaption from "@microflash/remark-figure-caption";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeToc from "rehype-toc";
import config from "./src/config/config.json";
import sitemap from "@astrojs/sitemap";
import createOgImage from "./src/integrations/og-image";
import algoliaQueries from "./src/integrations/algolia-queries";

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "https://retrorocket.biz",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  experimental: {
    assets: true,
  },
  image: {
    service: sharpImageService(),
  },
  integrations: [
    createOgImage(),
    algoliaQueries(),
    react(),
    sitemap({
      filter: (page) =>
        page.search(/(?:^|\/)page\/|^404$|^privacy-policy$/) === -1,
    }),
    tailwind({
      config: {
        applyBaseStyles: false,
      },
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
      rehypeSlug,
      [
        rehypeToc,
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
