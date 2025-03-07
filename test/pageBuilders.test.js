import { test, suite } from "node:test";
import assert from "node:assert";
import {
  getSourceFilePaths,
  computeHtmlFilePath,
  computeWebPath,
  getTitle,
  buildPreviewText,
} from "../lib/buildPages.js";

suite("Page Building", () => {
  const MD_DIR = "./test/sources/";
  const MD_FILE = "./test/sources/page.md";
  test("Get article source paths", () => {
    const result = getSourceFilePaths(MD_DIR);
    assert.deepStrictEqual(result, [MD_FILE]);
  });
  test("Compute article destination path", () => {
    const result = computeHtmlFilePath("./src/articles/public/test-article.md");
    assert.equal(result, "./www/articles/test-article.html");
  });
  test("Compute article web path", () => {
    const result = computeWebPath("./www/articles/test-article.html");
    assert.equal(result, "/articles/test-article.html");
  });
  test("Extract H1 for title", () => {
    const result = getTitle(MD_FILE);
    assert.equal(result, "This is Article Title, AKA the H1");
  });
  test("Extract copy as preview", () => {
    const result = buildPreviewText(MD_FILE);
    const expectation =
      "Here is a bit of sample copy to be truncated and abbreviated and to serve as\nthe introduction to the article. Test one, test two...";
    assert.equal(result, expectation);
  });
});
