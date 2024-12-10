import { type ExecOptions, exec } from "node:child_process";

import { type CollectionEntry, getCollection } from "astro:content";
import { marked } from "marked";

function run(cmd: string, options?: ExecOptions) {
  return new Promise<{ stdout: string | Buffer; stderr: string | Buffer }>((resolve, reject) => {
    exec(cmd, options, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({ stdout, stderr });
    });
  });
}

async function created(id: string) {
  const res = await run(`git log --follow --format=%ad --date=unix ${id}.md`, { cwd: "./til" });
  return res.stdout.toString().trim().split("\n").at(-1) || "";
}

export async function getTILs() {
  const tils = await getCollection("til");
  return tils
    .filter(til => til.id.includes("/"))
    .map(til => ({ ...til, body: til.body?.replaceAll(/\[(.+?)\]\((.+?)\.md\)/g, "[$1]($2/)") }));
}

export async function getInfo(entry: CollectionEntry<"til">) {
  return {
    title:
      entry.body
        ?.match(/^# (.+)$/m)
        ?.at(1)
        ?.replaceAll("`", "") ?? "",
    body: entry.body,
    excerpt: marked.parse(
      entry.body
        ?.split("\n")
        .filter(Boolean)
        .find(line => !line.startsWith("#")) ?? "",
    ),
    date: new Date(Number(await created(entry.id)) * 1000),
    category: entry.id.split("/").at(0) ?? "",
    id: entry.id as string,
    href: `/${entry.id}/`,
  };
}
