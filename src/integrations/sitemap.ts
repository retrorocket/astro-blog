import type { AstroIntegration } from "astro";
import { SitemapStream, streamToPromise } from "sitemap";
import { writeFileSync } from "fs";
import { Readable } from "stream";
import { fileURLToPath } from "url";

// astro の sitemap 生成にバグがあるので自作する
// 参考: https://shinobiworks.com/blog/641/
const sitemap = (): AstroIntegration => {
  return {
    name: "return_lock/sitemap",
    hooks: {
      "astro:build:done": async ({ dir, pages }) => {
        const hostname = "https://retrorocket.biz";
        const sitemapStream = new SitemapStream({
          hostname,
        });
        const destinationDir = fileURLToPath(dir);
        const outputFileName = "sitemap.xml";
        const excludePattern = /(?:^|\/)page\/|^404$|^privacy-policy$/;
        const sitemapRoutes = pages
          .map(({ pathname }: any) => {
            if (!excludePattern.test(pathname)) return pathname;
          })
          .filter((v) => v);
        const sitemap = await streamToPromise(
          Readable.from(sitemapRoutes).pipe(sitemapStream)
        ).then((data) => data.toString());
        writeFileSync(destinationDir + outputFileName, sitemap);
        sitemapStream.end();
      },
    },
  };
};

export default sitemap;
