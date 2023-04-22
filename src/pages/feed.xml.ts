import rss from "@astrojs/rss";
import config from "@config/config.json";
const postImportResult = import.meta.glob("../content/posts/**/*.md", {
  eager: true,
});
const posts = Object.values(postImportResult).sort(
  (a: any, b: any) =>
    new Date(b.frontmatter.date && b.frontmatter.date).getTime() -
    new Date(a.frontmatter.date && a.frontmatter.date).getTime()
);

export const get = () =>
  rss({
    title: `${config.site.title} Blog Feed`,
    description: config.metadata.meta_description,
    site: config.site.base_url,
    stylesheet: "/rss/pretty-feed-v3.xsl",
    items: posts.map((post: any) => ({
      link: `${config.site.base_url}/archives/${post.frontmatter.postid}`,
      title: post.frontmatter.title,
      pubDate: post.frontmatter.date,
      description: post.frontmatter.excerpt,
    })),
  });
