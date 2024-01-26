import esbuild from "esbuild";
import fs from "fs-extra";
import { glob } from "glob";
import path from "path";
import { fileURLToPath } from "url";
import type { JSONSchemaForNPMPackageJsonFiles } from "@schemastore/package";

const pkg = fs.readJsonSync(
  path.join(process.cwd(), "package.json")
) as JSONSchemaForNPMPackageJsonFiles;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const here = (s: string) => path.join(__dirname, s);
const globsafe = (s: string) => s.replace(/\\/g, "/");

const allFiles = glob.sync(globsafe(here("./server/**/*.*")), {
  ignore: [
    "server/emailTemplates/**",
    "**/tsconfig.json",
    "**/eslint*",
    "**/__tests__/**",
  ],
});

const entries = allFiles.reduce<string[]>((acc, file) => {
  if (/\.(ts|js|tsx|jsx)$/.test(file)) {
    return [...acc, file];
  }

  const dest = file.replace(here("./server"), here("./server-build"));
  fs.ensureDirSync(path.parse(dest).dir);
  fs.copySync(file, dest);
  console.log(`copied: ${file.replace(`${here("./server")}/`, "")}`);

  return acc;
}, []);

console.log();
console.log("building...");

esbuild
  .build({
    entryPoints: entries,
    outdir: here("./server-build"),
    target: [`node${pkg.engines?.node ?? 20}`],
    platform: "node",
    format: "esm",
    logLevel: "info",
    bundle: true,
    packages: "external",
    external: ["../build/index.js"],
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
