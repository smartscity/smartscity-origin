import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const library = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/library' }),
  schema: z.object({
    contentId: z.string(),
    language: z.enum(['en', 'zh-CN']),
    status: z.enum(['draft', 'review', 'published']),
    kind: z.enum(['docs', 'blog']),
    cover: z.string().startsWith('/images/blog/').optional(),
    coverAlt: z.string().optional(),
    coverInArticle: z.boolean().default(true),
    product: z.enum([
      'enterprise-agents',
      'agent-reliability',
      'hyperraft',
      'qualitysphere',
      'starter-id',
      'reconsphere',
    ]),
    section: z.enum([
      'overview',
      'getting-started',
      'guides',
      'reference',
      'operations',
      'troubleshooting',
      'releases',
    ]),
    topic: z.enum([
      'enterprise-agents',
      'architecture-reliability',
      'release-recovery',
      'business-reliability',
      'ai-engineering',
      'product-practice',
    ]),
    title: z.string(),
    summary: z.string(),
    version: z.string(),
    order: z.number(),
    updated: z.string(),
    author: z.string(),
    sourceRevision: z.string(),
    sources: z.array(z.object({ title: z.string(), url: z.url() })),
    related: z.array(z.string()).default([]),
  }),
});
export const collections = { library };
