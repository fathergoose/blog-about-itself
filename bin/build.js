import markdownit from "markdown-it";
import { readFile, glob, writeFile } from "node:fs/promises";
import { Buffer } from "node:buffer";

async function combineHtml(parentFile, childContent) {
  // Read the parent HTML file
  const parentContent = await readFile(parentFile, "utf8");

  // Replace the template string with the child HTML content
  const result = parentContent.replace("{{___article_text___}}", childContent);

  // Return the combined HTML content
  return result;
}

try {
  const controller = new AbortController();
  const { signal } = controller;

  const TEMPLATE = "./www/index.html";

  (async () => {
    for await (const path of glob("./src/docs/public/**/*.md")) {
      const data = await readFile(path, { encoding: "utf8" });
      const md = markdownit();
      const child = md.render(data);
      const resultHtml = await combineHtml(TEMPLATE, child);
      const outFile = path.replace(
        /src\/docs\/public\/(.*)\.md/,
        "./www/articles/$1.html",
      );
      const htmlData = new Uint8Array(Buffer.from(resultHtml));
      await writeFile(outFile, htmlData);
    }
  })();
} catch (err) {
  console.error(err);
}
