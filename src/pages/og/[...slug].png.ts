import { getCollection, getEntryBySlug, type CollectionEntry } from "astro:content";

export async function getStaticPaths() {
  const entries = await getCollection("til");
  return entries.map(post => ({
    params: { slug: post.slug }
  }));
}

import fs from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";
import type { APIRoute } from "astro";
import { getInfo } from "../../util/entry";

export const GET: APIRoute = async function GET({ params }) {
  const overpass = await fs.readFile("./src/style/overpass-regular.ttf");
  const overpassBold = await fs.readFile("./src/style/overpass-bold.ttf");
  const jetbrainsmono = await fs.readFile("./src/style/jetbrainsmono-italic.ttf");

  const entry = await getEntryBySlug("til", params.slug as CollectionEntry<"til">["slug"]);
  const info = await getInfo(entry);

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          padding: "5%",
          fontFamily: "Overpass",
          letterSpacing: "-1ch",
          lineHeight: 1,
          textWrap: "balanced"
        },
        children: [
          { type: "div", props: { style: { fontSize: 32 }, children: "Today I Learned" } },
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column", marginTop: "auto" },
              children: [
                {
                  type: "p",
                  props: {
                    style: { fontSize: 32, fontFamily: "JetBrains Mono", color: "#00000066" },
                    children: info.category
                  }
                },
                {
                  type: "div",
                  props: { style: { fontSize: 64, fontWeight: 700 }, children: info.title }
                }
              ]
            }
          }
        ]
      }
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Overpass", data: overpass, weight: 400, style: "normal" },
        { name: "Overpass", data: overpassBold, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: jetbrainsmono, weight: 400, style: "italic" }
      ]
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png, { headers: { "Content-Type": "image/png" } });
};
