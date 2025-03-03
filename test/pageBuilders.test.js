import { test, suite } from "node:test";
import assert from "node:assert";
import {
  getSourceFilePaths,
  buildArticles,
  buildPreviewText,
  buildIndex,
  getTitle,
} from "../lib/pageBuilders.js";

suite("Page Building", (s) => {
  test("Get article source paths", (t) => {
    const result = getSourceFilePaths("./test/sources/");
    assert.deepStrictEqual(result, ["./test/sources/page.md"]);
  });
  test("Compute article destination path", (t) => {});
  test("Compute article web path", () => {});
  test("Extract H1 for title", (t) => {});
  test("Extract copy as preview", (t) => {});
});
