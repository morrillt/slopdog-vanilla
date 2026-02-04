import { createContentHandler } from "@rockcap/docs-router/server";
import path from "path";

const config = {
  contentRoot: path.resolve(process.cwd(), ".."),
  directories: ["docs", "plans"],
};

export const GET = createContentHandler(config);
