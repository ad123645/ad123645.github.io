import { siteConfig } from '@/data/site';

export function buildDescription(description?: string) {
  return description || siteConfig.description;
}
