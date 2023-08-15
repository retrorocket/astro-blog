import rss from "@astrojs/rss";
import config from "@config/config.json";
import { JSDOM } from "jsdom";
import { sortByDate } from "@lib/utils/sortFunctions";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

const posts = await getCollection("posts");
const sortPostByDate: CollectionEntry<"posts">[] = sortByDate(posts);

const jsdom = new JSDOM();
const parser = new jsdom.window.DOMParser();

export const get = () =>
  rss({
    title: `${config.site.title} Blog Feed`,
    description: config.metadata.meta_description,
    site: config.site.base_url,
    stylesheet: "/rss/pretty-feed-v3.xsl",
    items: sortPostByDate.map((post) => ({
      link: `${config.site.base_url}/archives/${post.data.postid}`,
      title: post.data.title,
      pubDate: post.data.date,
      description:
        parser.parseFromString(post.data.excerpt || "", "text/html")
          .documentElement.textContent || "",
    })),
  });
