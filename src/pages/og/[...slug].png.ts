import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const entries = await getCollection("til");
  return entries.map(post => ({
    params: { slug: post.slug },
    props: post
  }));
}

import fs from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";
import type { APIRoute } from "astro";

export const GET: APIRoute = async function ({ params, request }) {
  const overpass = await fs.readFile("./src/style/overpass-regular.ttf");

  const svg = await satori(
    {
      type: "h1",
      props: { children: "Hello world" }
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Overpass",
          data: overpass,
          weight: 400,
          style: "normal"
        }
      ]
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png"
    }
  });
};
