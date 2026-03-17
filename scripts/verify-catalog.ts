import { flatCatalogNodes, catalogByCode } from '../src/data/catalog/clc';

const duplicateCodes = new Set<string>();
const seenCodes = new Set<string>();
const duplicateSlugs = new Set<string>();
const seenSlugs = new Set<string>();

for (const node of flatCatalogNodes) {
  if (seenCodes.has(node.code)) duplicateCodes.add(node.code);
  seenCodes.add(node.code);

  if (seenSlugs.has(node.slug)) duplicateSlugs.add(node.slug);
  seenSlugs.add(node.slug);

  if (node.parentCode && !catalogByCode.has(node.parentCode)) {
    throw new Error(`Missing parent for ${node.code}: ${node.parentCode}`);
  }
}

if (duplicateCodes.size > 0) {
  throw new Error(`Duplicate catalog codes: ${[...duplicateCodes].join(', ')}`);
}

if (duplicateSlugs.size > 0) {
  throw new Error(`Duplicate catalog slugs: ${[...duplicateSlugs].join(', ')}`);
}

console.log(`Catalog nodes: ${flatCatalogNodes.length}`);
console.log('Catalog verification passed.');
