import rss from "@astrojs/rss";
import { marked } from "marked";

import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { getInfo, getTILs } from "../util/entry";

/** @param {import("astro").APIContext} ctx */
export async function GET(ctx) {
  const title = SITE_TITLE;
  const entries = await getTILs().then(entries => Promise.all(entries.map(getInfo)));

  return rss({
    title,
    description: SITE_DESCRIPTION,
    site: ctx.site || "https://til.jakelazaroff.com",
    items: entries
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10)
      .map(post => ({
        title: post.title,
        content: marked.parse(post.body.replaceAll(/^# .+/g, "")),
        categories: [post.category],
        pubDate: new Date(post.date.getTime() + new Date().getTimezoneOffset() * 60_000),
        link: `/${post.id}`,
      })),
  });
}
