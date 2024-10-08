import satori from "satori";
import sharp from "sharp";
import { readFileSync, mkdir, existsSync } from "fs";
import type { AstroIntegration } from "astro";
import { globSync } from "glob";
import grayMatter from "gray-matter";
import path from "path";
import { fileURLToPath } from "url";
import { loadDefaultJapaneseParser } from "budoux";
import { Buffer } from "node:buffer";

const parser = loadDefaultJapaneseParser();

// 参考: https://zenn.dev/ikuma/scraps/2bd2b9dc3605d7
const generate = async (
  title: string,
  {
    background,
    font,
  }: {
    background: string;
    font: Buffer;
  },
  filename: string,
): Promise<void> => {
  const words = parser.parse(title).map((word) => {
    // 分かち書きされない文字を分割する
    return word.split(/(?<=(?:・|,|スマートフォンで|】|::DateManip))/g);
  });
  const svg = await satori(
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        width: 1200,
        height: 630,
        backgroundImage: `url(${background})`,
        backgroundSize: "1200px 630px",
      }}
    >
      <div
        style={{
          paddingBottom: "80px",
          paddingLeft: "30px",
          paddingRight: "30px",
          display: "flex",
          justifyContent: "center",
          width: 1040,
          height: 390,
          fontSize: "50px",
          color: "#fff",
          flexWrap: "wrap",
          textOverflow: "ellipsis",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        {words.flat().map((word) => {
          return <span style={{ display: "block" }}>{word}</span>;
        })}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "NotoSansJP",
          data: font,
          weight: 900,
          style: "normal",
        },
      ],
    },
  );
  await sharp(Buffer.from(svg)).png().toFile(filename);
};

export default (): AstroIntegration => ({
  name: "build-ogimages",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      const outputdir = fileURLToPath(dir) + "og-images/";
      const filenames = globSync([
        "./src/content/posts/**/*.md*",
        "./src/content/pages/*.md*",
      ]);
      const data: any = filenames
        .map((filename) => {
          try {
            const markdownWithMeta = readFileSync(filename);
            const { data: frontmatter } = grayMatter(markdownWithMeta);
            const postid =
              frontmatter.postid ?? filename.split(/[.\/]/).slice(-2)[0];
            const imgpath = outputdir + postid + ".png";
            if (existsSync(imgpath)) {
              console.log("\x1b[90m", imgpath + ": skip");
              return;
            }
            return {
              postid: postid,
              title: frontmatter.title,
            };
          } catch (e: any) {
            console.log(e.message);
          }
        })
        .filter((v) => v);

      const background = readFileSync(
        path.resolve("./src/assets/images/og-image.png"),
        "base64",
      );
      const font = readFileSync(
        path.resolve("./src/assets/fonts/NotoSansJP-Bold.ttf"),
      );

      if (!existsSync(outputdir)) {
        mkdir(outputdir, (e) => {
          if (e) console.log(e);
        });
      }
      for (const attr of data) {
        const filename = outputdir + attr.postid + ".png";
        await generate(
          attr.title,
          {
            background: `data:image/png;base64,${background}`,
            font,
          },
          filename,
        );
      }
    },
  },
});
