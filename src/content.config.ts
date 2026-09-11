import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { legalLoader } from "./content/loaders/legal";

// content lives as Markdown in these collections

const services = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/services" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      eyebrow: z.string(),
      oneLiner: z.string(),
      summary: z.string(),
      closing: z.string(),
      order: z.number(),
      rateHour: z.string().optional(),
      rateDay: z.string().optional(),
      rateOneoff: z.string().optional(),
      rateNote: z.string().optional(), // extra detail shown below the rate, e.g. multiple price points or terms
      subsections: z.array(
        z.object({
          title: z.string(),
          body: z.string(),
          rateHour: z.string().optional(),
          rateDay: z.string().optional(),
          rateOneoff: z.string().optional(),
          rateNote: z.string().optional(), // stands in for the rate when no rateHour/rateDay/rateOneoff is set, e.g. "Contact for quote"
          img: image().optional(), // resolved to optimised ImageMetadata by Astro
          source: z.string().optional(), // id of the matching entry in the credits collection, if the image needs attribution
          upcoming: z.boolean().optional(),
        }),
      ),
    }),
});

// One entry per PUBLISHED VERSION of a policy — prior versions stay reviewable.
const legal = defineCollection({
  loader: legalLoader(),
  schema: z.object({
    policy: z.enum([
      "terms-website-use",
      "privacy",
      "data-processing",
      "ai-usage",
    ]),
    label: z.string(),
    title: z.string(),
    version: z.string(),
    date: z.string(), // ISO publication date
    summary: z.string().optional(), // one-line "what changed" shown in the version history
    current: z.boolean().default(false),
    comingSoon: z.boolean().default(false),
  }),
});

// Image attribution — filename (id) is the key referenced by service subsections (`source: <id>`).
const credits = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/credits" }),
  schema: z.object({
    order: z.number(),
    location: z.string(),
    creator: z.string(),
    source: z.string(),
    link: z.string().url().nullable(),
    pending: z.boolean().default(false),
  }),
});

// Single-file collections — one-off editable copy for Home and Contact.
const home = defineCollection({
  loader: glob({ pattern: "home.md", base: "./src/content/pages" }),
  schema: z.object({
    heading: z.string(),
    intro: z.string(),
    cta: z.string(),
  }),
});

const contact = defineCollection({
  loader: glob({ pattern: "contact.md", base: "./src/content/pages" }),
  schema: z.object({
    eyebrow: z.string(),
    heading: z.string(),
  }),
});

export const collections = { services, legal, home, contact, credits };
