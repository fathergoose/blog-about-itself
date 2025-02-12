import markdownit from "markdown-it";
import { cp, readdir, readFile, writeFile } from "node:fs/promises";
import { Buffer } from "node:buffer";

async function combineHtml(template, childContent) {
  const result = template.replace("{{___article_text___}}", childContent);
  return result;
}

async function buildPages() {
  const TEMPLATE = "./src/templates/index.html";

  (async () => {
    const basePath = "./src/articles/public/";
    const files = await readdir(basePath, {
      recursive: true,
    });

    const mdFilePaths = files
      .filter((path) => path.slice(-3) === ".md")
      .map((fileName) => `${basePath}${fileName}`);

    mdFilePaths.forEach(async (file) => {
      const data = await readFile(file, { encoding: "utf8" });
      const md = markdownit();
      const innerHtml = md.render(data);
      const parentContent = await readFile(TEMPLATE, "utf8");
      const resultHtml = await combineHtml(parentContent, innerHtml);
      const outFile = file.replace(
        /src\/articles\/public\/(.*)\.md/,
        "./www/$1.html",
      );
      const htmlData = new Uint8Array(Buffer.from(resultHtml));
      await writeFile(outFile, htmlData);
    });
  })();
}

async function buildStyles() {
  // Keep it simple for now while keeping the pattern
  await cp("./src/styles/style.css", "./www/css/style.css");
}
async function copyStaticFiles() {
  await cp("./src/static/", "./www/", { recursive: true });
}

try {
  await buildPages();
  await buildStyles();
  await copyStaticFiles();
} catch (err) {
  console.error(err);
}
