import algoliasearch from "algoliasearch";
import grayMatter from "gray-matter";
import { marked } from "marked";
import { JSDOM } from "jsdom";
import { readFileSync } from "fs";
import { globSync } from "glob";
import type { AstroIntegration } from "astro";

const jsdom = new JSDOM();
const parser = new jsdom.window.DOMParser();

export default (): AstroIntegration => ({
  name: "algolia-queries",
  hooks: {
    "astro:build:done": async () => {
      if (!process.env.PRIVATE_ALGOLIA_WRITE_KEY) return;
      const filenames = globSync("./src/content/posts/**/*.md*");
      const data = filenames.map((filename) => {
        try {
          const markdownWithMeta = readFileSync(filename);
          const { data: frontmatter, content } = grayMatter(markdownWithMeta);
          const parsedContent =
            parser.parseFromString(
              marked(content)
                .replace(/<br>/g, "\n")
                .replace(/__ais-highlight__/g, ""),
              "text/html",
            ).documentElement.textContent ?? "";
          return {
            objectID: frontmatter.postid,
            slug: `/archives/${frontmatter.postid}`,
            title: frontmatter.title,
            content:
              filename.split(".").pop() === "mdx"
                ? parsedContent
                    .replace(/^import.+from.+;$/gm, "")
                    .replace(/\n/g, " ")
                    .replace(/ +/g, " ")
                : parsedContent.replace(/\n/g, " ").replace(/ +/g, " "),
          };
        } catch (e: any) {
          console.log(e.message);
        }
      });

      const client = algoliasearch(
        process.env.PUBLIC_ALGOLIA_APPID ?? "",
        process.env.PRIVATE_ALGOLIA_WRITE_KEY ?? "",
      );
      const index = client.initIndex("blog_retrorocket");
      await index.saveObjects(JSON.parse(JSON.stringify(data)), {
        autoGenerateObjectIDIfNotExist: true,
      });
    },
  },
});
