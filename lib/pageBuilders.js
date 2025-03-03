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
    return articles.map((a) => `<div class="index-links">
        <a class="title-link" href="${a.webPath}">${a.title}</a>
        <p class="article-preview">${a.previewText}</p>
      </div>`);
}
export function buildArticles(template) {
    const basePath = "./src/articles/public/";
    const files = readdirSync(basePath, {
        recursive: true,
    });
    const mdFilePaths = files
        .filter((path) => path.slice(-3) === ".md")
        .map((fileName) => `${basePath}${fileName}`);
    const htmlPaths = mdFilePaths.map((path) => path.replace(/src\/articles\/public\/(.*)\.md/, "www/articles/$1.html"));
    htmlPaths.forEach((htmlPath, i) => {
        const mdFilePath = mdFilePaths[i];
        console.log(`Building ${mdFilePath} to ${htmlPath}`);
        const data = readFileSync(mdFilePaths[i], { encoding: "utf8" });
        const md = markdownit();
        const child = md.render(data);
        const resultHtml = combineHtml(template, child);
        const htmlData = new Uint8Array(Buffer.from(resultHtml));
        writeFileSync(htmlPath, htmlData);
    });
    return htmlPaths;
}
export function buildIndex(template, articles) {
    const linkElements = createLinkElements(articles);
    const innerHTML = `<div class="link-list">\n${linkElements.join("\n")}\n</div>`;
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
    // '#' or whitespace. After 127 chars, match till the end of a word
    const regex = /^[^#\s].{127}\S*/m;
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
    return path.replace(/src\/articles\/public\/(.*)\.md/, "www/articles/$1.html");
}
// TODO: Use fs.path to make more robust
export function computeWebPath(path) {
    // Remove "./www"
    return path.slice(5);
}
