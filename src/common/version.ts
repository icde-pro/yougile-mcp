import { readFileSync } from "fs";
import { join } from "path";

const pkgPath = join(process.cwd(), "package.json");
let pkgContent: string;

try {
  // Try to read from the current working directory first
  pkgContent = readFileSync(pkgPath, "utf-8");
} catch {
  // Fallback: try to read from the source directory
  const sourceDir = __dirname;
  const fallbackPath = join(sourceDir, "..", "..", "package.json");
  pkgContent = readFileSync(fallbackPath, "utf-8");
}

const pkg = JSON.parse(pkgContent);

export function getVersion() {
  return pkg.version;
}