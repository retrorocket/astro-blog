import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import remarkFigureCaption from "@microflash/remark-figure-caption";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import config from "./src/config/config.json";

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  integrations: [
    react(),
    sitemap({
      serialize(item) {
        if (/\/page\//.test(item.url)) {
          return undefined;
        }
        return item;
      },
    }),
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
        "@shortcodes/Video",
        "@shortcodes/Youtube",
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
