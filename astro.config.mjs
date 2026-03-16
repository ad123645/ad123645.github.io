import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const siteUrl = process.env.SITE_URL || 'https://ad123645.github.io';
const repoName = process.env.REPO_NAME || 'ad123645.github.io';
const isCustomDomain = !siteUrl.includes('github.io');
const isUserPagesRepo = repoName.endsWith('.github.io');

export default defineConfig({
  site: siteUrl,
  ...(isCustomDomain || isUserPagesRepo ? {} : { base: `/${repoName}` }),
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
