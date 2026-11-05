import { defineContentConfig, defineCollection, z } from '@nuxt/content'

// Anything in [TODO: …] square brackets is a visible placeholder; components render it as such.
const cover = z.object({
  src: z.string().optional(),
  alt: z.string().optional(),
  todo: z.string().optional(),
})

export default defineContentConfig({
  collections: {
    // Case studies. Featured ones are listed in file order (1., 2., …); archive ones come after.
    work: defineCollection({
      type: 'page',
      source: 'work/**/*.md',
      schema: z.object({
        outcome: z.string(),
        year: z.string(),
        role: z.string(),
        org: z.string().optional(),
        tier: z.enum(['featured', 'archive', 'side']),
        confidential: z.boolean().default(false),
        cover: cover.optional(),
        links: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
        // Home card: sentence-case tags and a collaborator quote (placeholders until real).
        tags: z.array(z.string()).optional(),
        quote: z.object({ text: z.string(), name: z.string(), role: z.string().optional() }).optional(),
        // Case-study template (Phase 4). The body holds only the numbered sections.
        hero: cover.optional(),
        team: z.string().optional(),
        timeframe: z.string().optional(),
        tools: z.array(z.string()).optional(),
        status: z.string().optional(),
        context: z.string().optional(),
        myRole: z.array(z.string()).optional(),
        results: z.object({
          text: z.string().optional(),
          stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
        }).optional(),
        reflection: z.string().optional(),
      }),
    }),




    // Side projects and things I make: square tiles on /work. One YAML file per tile.
    tiles: defineCollection({
      type: 'data',
      source: 'tiles/*.yml',
      schema: z.object({
        title: z.string(),
        category: z.string(),
        description: z.string(),
        instructions: z.string(),
        scene: z.enum(['print', 'macropad', 'books', 'drawing', 'robot']).optional(),
        poster: z.string().optional(),
        href: z.string().optional(),
        placeholder: z.string().optional(),
        // Reading tile only: the stack, bottom first.
        books: z.array(z.object({ title: z.string(), author: z.string().optional(), why: z.string().optional() })).optional(),
      }),
    }),

    // Notes: simple writing. The nav shows "Notes" only once at least one exists.
    notes: defineCollection({
      type: 'page',
      source: 'notes/*.md',
      schema: z.object({
        description: z.string(),
        date: z.string(),
        draft: z.boolean().default(false),
      }),
    }),

    // Standalone pages with an editable body (about).
    pages: defineCollection({
      type: 'page',
      source: 'pages/*.md',
      schema: z.object({
        description: z.string(),
        intro: z.string(),
        facts: z.array(z.object({ label: z.string(), value: z.string() })),
        languages: z.array(z.object({ name: z.string(), level: z.string() })),
        toolbox: z.array(z.object({ group: z.string(), items: z.array(z.string()) })),
        certifications: z.array(z.string()),
        workingWithMe: z.string(),
        photos: z.array(cover),
      }),
    }),

    // Home page copy: about teaser and "How I work".
    home: defineCollection({
      type: 'data',
      source: 'home.yml',
      schema: z.object({
        about: z.object({
          photo: z.object({ src: z.string(), alt: z.string() }),
          statement: z.string(),
          paragraphs: z.array(z.string()),
        }),
        howIWork: z.array(z.object({ title: z.string(), text: z.string() })),
      }),
    }),

    site: defineCollection({
      type: 'data',
      source: 'site.yml',
      schema: z.object({
        name: z.string(),
        positioning: z.string(),
        status: z.string(),
        proof: z.array(z.string()),
        currently: z.array(z.object({ label: z.string(), detail: z.string(), href: z.string() })),
        education: z.string(),
        email: z.string(),
        linkedin: z.string(),
        github: z.string(),
        cv: z.string(),
        contactIntro: z.string(),
      }),
    }),

  },
})
