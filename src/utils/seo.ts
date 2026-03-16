import { siteConfig } from '@/data/site';

export function buildPageTitle(title?: string) {
  return title ? `${title} | ${siteConfig.title}` : siteConfig.title;
}
