import { readFileSync, readdirSync } from "node:fs";
import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import type { Loader } from "astro/loaders";

// Matches Obsidian-style [[name]] / ![[name]] wikilinks — resolved against
// src/content/snippets/<name>.md. Case and spacing in `name` don't need to match the
// filename exactly (editors won't reliably match either) — see `snippetFileName` below.
const SNIPPET_REF = /!?\[\[([^\]]+)\]\]/g;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

// Custom loader (instead of the built-in glob() loader) so that editing a shared
// snippet re-renders every legal doc that references it — glob() only re-syncs the
// one file that changed on disk, which would leave transcluded content stale.
export function legalLoader(): Loader {
  return {
    name: "legal-loader",
    load: async ({
      store,
      config,
      parseData,
      renderMarkdown,
      generateDigest,
      watcher,
      logger,
    }) => {
      const dir = new URL("./content/legal/", config.srcDir);
      const snippetsDir = new URL("./content/snippets/", config.srcDir);
      const dirPath = fileURLToPath(dir);
      const snippetsPath = fileURLToPath(snippetsDir);

      const snippetFileName = (rawName: string) =>
        rawName.trim().toLowerCase().replace(/\s+/g, "-");

      const expand = (body: string) =>
        body.replace(SNIPPET_REF, (match, rawName) => {
          const name = snippetFileName(rawName);
          try {
            return readFileSync(new URL(`./${name}.md`, snippetsDir), "utf-8");
          } catch {
            logger.warn(
              `Unknown snippet ${match} — add src/content/snippets/${name}.md`,
            );
            return match;
          }
        });

      async function syncFile(filename: string) {
        const fileUrl = new URL(`./${filename}`, dir);
        const raw = readFileSync(fileUrl, "utf-8");
        const match = FRONTMATTER.exec(raw);
        if (!match) {
          logger.warn(`No frontmatter found in ${filename}`);
          return;
        }
        const [, frontmatter, rawBody] = match;
        const data = parseYaml(frontmatter) ?? {};
        const id = filename.replace(/\.md$/, "");
        const body = expand(rawBody);
        const filePath = relative(
          fileURLToPath(config.root),
          fileURLToPath(fileUrl),
        );
        const parsedData = await parseData({ id, data, filePath });
        const rendered = await renderMarkdown(body, { fileURL: fileUrl });
        store.set({
          id,
          data: parsedData,
          body,
          filePath,
          digest: generateDigest(body),
          rendered,
        });
      }

      async function syncAll() {
        store.clear();
        const files = readdirSync(dirPath).filter((f) => f.endsWith(".md"));
        await Promise.all(files.map(syncFile));
      }

      await syncAll();

      if (!watcher) return;
      watcher.add(dirPath);
      watcher.add(snippetsPath);
      const onChange = (changedPath: string) => {
        if (
          changedPath.startsWith(dirPath) ||
          changedPath.startsWith(snippetsPath)
        ) {
          syncAll().then(() => logger.info("Reloaded legal docs"));
        }
      };
      watcher.on("change", onChange);
      watcher.on("add", onChange);
      watcher.on("unlink", onChange);
    },
  };
}
