import algoliasearch from "algoliasearch"; // 追加
import grayMatter from "gray-matter";
import fs from "fs";
import { globSync } from "glob";
import removeMarkdown from "remove-markdown";
import type { AstroIntegration } from "astro";

export default (): AstroIntegration => ({
  name: "algolia-queries",
  hooks: {
    "astro:build:done": async () => {
      const filenames = globSync("./src/content/posts/**/*.md");
      const data = filenames.map((filename) => {
        try {
          const markdownWithMeta = fs.readFileSync(filename);
          const { data: frontmatter, content } = grayMatter(markdownWithMeta);
          return {
            objectID: frontmatter.postid,
            slug: `/archives/${frontmatter.postid}`,
            title: frontmatter.title,
            content: removeMarkdown(content).replace(/\n/g, ""),
          };
        } catch (e) {
          // console.log(e.message)
        }
      });

      const client = algoliasearch(
        process.env.PUBLIC_ALGOLIA_APPID?.toString() || "",
        process.env.PRIVATE_ALGOLIA_WRITE_KEY?.toString() || ""
      );
      const index = client.initIndex("blog_retrorocket");
      await index.saveObjects(JSON.parse(JSON.stringify(data)), {
        autoGenerateObjectIDIfNotExist: true,
      });
    },
  },
});
