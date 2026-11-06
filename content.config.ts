import { defineContentConfig, defineCollection, z } from '@nuxt/content'

// Anything in [TODO: …] square brackets is a visible placeholder; components render it as such.
const cover = z.object({
  src: z.string().optional(),
  alt: z.string().optional(),
  todo: z.string().optional(),
})

// Every collection has a German twin (<name>_de) read from content/de/, same schema.
type Def = Parameters<typeof defineCollection>[0]
const pair = <N extends string>(name: N, def: Def) => ({
  [name]: defineCollection(def),
  [`${name}_de`]: defineCollection({ ...def, source: `de/${def.source as string}` } as Def),
}) as Record<N | `${N}_de`, ReturnType<typeof defineCollection>>

export default defineContentConfig({
  collections: {
    // Case studies. Featured ones are listed in file order (1., 2., …); archive ones come after.
    ...pair('work', {
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
        team: z.union([z.string(), z.array(z.string())]).optional(),
        // Case-study spec and quick read.
        services: z.array(z.string()).optional(),
        date: z.string().optional(),
        tldr: z.object({ problem: z.string(), role: z.string(), did: z.string(), outcome: z.string() }).optional(),
        keyVisuals: z.array(cover.extend({ caption: z.string().optional() })).optional(),
        // When set, cards link here instead of /work/<slug> (e.g. the pipeline essay in Notes).
        href: z.string().optional(),
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
    ...pair('tiles', {
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
    ...pair('notes', {
      type: 'page',
      source: 'notes/*.md',
      schema: z.object({
        description: z.string(),
        date: z.string(),
        draft: z.boolean().default(false),
      }),
    }),

    // Standalone pages with an editable body (about).
    ...pair('pages', {
      type: 'page',
      source: 'pages/*.md',
      schema: z.object({
        description: z.string(),
        intro: z.string(),
        // A small stack of photos of me (portraits, talks, presentations). Placeholders allowed.
        photos: z.array(cover),
        experience: z.array(z.object({ when: z.string(), what: z.string(), where: z.string() })),
        // Recognition as cards: a photo (or placeholder), what it was, when, and a link.
        recognition: z.array(z.object({
          title: z.string(),
          detail: z.string(),
          year: z.string(),
          href: z.string().optional(),
          image: cover.optional(),
        })),
        outside: z.object({ text: z.string(), photos: z.array(cover) }),
      }),
    }),

    // Home page copy: about teaser and "How I work".
    ...pair('home', {
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

    ...pair('site', {
      type: 'data',
      source: 'site.yml',
      schema: z.object({
        name: z.string(),
        positioning: z.string(),
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
