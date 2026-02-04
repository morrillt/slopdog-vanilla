import { createManifestHandler } from "@rockcap/docs-router/server";
import path from "path";

const config = {
  contentRoot: path.resolve(process.cwd(), ".."),
  directories: ["docs", "plans"],
  taxonomyPath: path.resolve(process.cwd(), "..", "docs", "taxonomy.yaml"),
};

export const GET = createManifestHandler(config);
