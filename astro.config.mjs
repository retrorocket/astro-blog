import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import rehypeFigure from "@microflash/rehype-figure";
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
  integrations: [
    createOgImage(),
    algoliaQueries(),
    react(),
    sitemap({
      filter: (page) => page.search(/\/page\/|\/privacy-policy$/) === -1,
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
    rehypePlugins: [
      rehypeSlug,
      rehypeFigure,
      [
        rehypeToc,
        {
          customizeTOC: (toc) => {
            // 見出しが一つもない場合はTOCを生成しない
            if (!toc.children.some((child) => child.children.length > 0)) {
              return false;
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
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
        },
      },
    },
  },
});
