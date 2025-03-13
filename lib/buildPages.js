import markdownit from "markdown-it";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { Buffer } from "node:buffer";

function combineHtml(parentFile, childContent) {
  const parentContent = readFileSync(parentFile, "utf8");
  const result = parentContent.replace("{{___article_text___}}", childContent);
  return result;
}
//{ path: string, title: string, previewText: string }
function createLinkElements(articles) {
  return articles.map(
    (a) => `<a class="title-link" href="${a.webPath}">
      <div class="index-links">
        <h2>${a.title}</h2>
        <p class="article-preview">${a.previewText}</p>
      </div>
     </a>`,
  );
}
function buildArticles(articles, template) {
  articles.forEach((article) => {
    const mdFilePath = article.mdFilePath;
    const htmlFilePath = article.htmlFilePath;

    console.log(`Building ${mdFilePath} to ${htmlFilePath}`);

    const data = readFileSync(mdFilePath, { encoding: "utf8" });
    const md = markdownit();
    const child = md.render(data);
    const resultHtml = combineHtml(template, child);
    const htmlData = new Uint8Array(Buffer.from(resultHtml));

    writeFileSync(htmlFilePath, htmlData);
  });
}
function buildIndex(articles, template) {
  const linkElements = createLinkElements(articles);
  const innerHTML = `<h1 class="index-head">Recent Articles</h1><div class="link-list">\n${linkElements.join("\n")}\n</div>`;
  const indexPage = combineHtml(template, innerHTML);
  const htmlData = new Uint8Array(Buffer.from(indexPage));
  writeFileSync("www/index.html", htmlData);
}
export function getTitle(filePath) {
  const decoder = new TextDecoder();
  const data = readFileSync(filePath);
  const text = decoder.decode(data) ?? "";
  // Positive lookbehind matching the #<space> without including it in the result
  const regex = /(?<=^# ).*/;
  const title = text.match(regex)?.at(0);
  console.log("Calculated title: ", title);
  return title ?? "";
}
export function buildPreviewText(filePath) {
  const decoder = new TextDecoder();
  const data = readFileSync(filePath);
  const text = decoder.decode(data) ?? "";
  // Match the first 127 characters of a  line beging with anything besides a
  // '' or whitespace. After 127 chars, match till the end of a word
  // ^ Match the bgining of the string or line (with m flag) that starts with a
  // word-character followed by 127 of anything then match word chars untill
  // hitting a non-word character
  const regex = /^\w.{127}\w*/ms;
  const previewText = `${text.match(regex)?.at(0)}...`;
  console.log("Calculated preview:\n", previewText);
  return previewText;
}
export function getSourceFilePaths(basePath) {
  const files = readdirSync(basePath, {
    recursive: true,
  });
  return files
    .filter((path) => path.slice(-3) === ".md")
    .map((fileName) => `${basePath}${fileName}`);
}
export function computeHtmlFilePath(path) {
  return path.replace(
    /src\/articles\/public\/(.*)\.md/,
    "www/articles/$1.html",
  );
}
// TODO: Use fs.path to make more robust
export function computeWebPath(path) {
  // Remove "./www"
  return path.slice(5);
}

try {
  const TEMPLATE = "./src/templates/articles.template.html";
  const mdFiles = getSourceFilePaths("./src/articles/public/");
  const articleSummeries = mdFiles.map((mdFilePath) => ({
    mdFilePath,
    htmlFilePath: computeHtmlFilePath(mdFilePath),
    webPath: computeWebPath(computeHtmlFilePath(mdFilePath)),
    title: getTitle(mdFilePath),
    previewText: buildPreviewText(mdFilePath),
  }));
  buildArticles(articleSummeries, TEMPLATE);
  buildIndex(articleSummeries, TEMPLATE);
} catch (err) {
  console.error(err);
}
