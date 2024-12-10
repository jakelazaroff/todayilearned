import type { CollectionEntry } from "astro:content";

import { getInfo, getTILs } from "../../util/entry";

export async function getStaticPaths() {
  const entries = await getTILs();
  return entries.map(post => ({ params: { id: post.id }, props: post }));
}

import * as fs from "node:fs/promises";
import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";

export const GET: APIRoute<CollectionEntry<"til">> = async function GET({ props }) {
  const overpass = await fs.readFile("./src/style/overpass-regular.ttf");
  const overpassBold = await fs.readFile("./src/style/overpass-bold.ttf");
  const jetbrainsmono = await fs.readFile("./src/style/jetbrainsmono-italic.ttf");

  const info = await getInfo(props);

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
          textWrap: "balanced",
        },
        children: [
          {
            type: "div",
            props: { style: { fontSize: 32 }, children: "Today I Learned" },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                marginTop: "auto",
              },
              children: [
                {
                  type: "p",
                  props: {
                    style: {
                      fontSize: 32,
                      fontFamily: "JetBrains Mono",
                      color: "#00000066",
                    },
                    children: info.category,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { fontSize: 64, fontWeight: 700 },
                    children: info.title,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Overpass", data: overpass, weight: 400, style: "normal" },
        { name: "Overpass", data: overpassBold, weight: 700, style: "normal" },
        {
          name: "JetBrains Mono",
          data: jetbrainsmono,
          weight: 400,
          style: "italic",
        },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png, { headers: { "Content-Type": "image/png" } });
};
