export type { CatalogNode } from './core';

import type { CatalogNode } from './core';
import { A_BRANCH } from './generated/a/index';
import { B_BRANCH } from './generated/b/index';
import { C_BRANCH } from './generated/c/index';
import { D_BRANCH } from './generated/d/index';
import { E_BRANCH } from './generated/e/index';
import { F_BRANCH } from './generated/f/index';
import { G_BRANCH } from './generated/g/index';
import { H_BRANCH } from './generated/h/index';
import { I_BRANCH } from './generated/i/index';
import { J_BRANCH } from './generated/j/index';
import { K_BRANCH } from './generated/k/index';
import { N_BRANCH } from './generated/n/index';
import { O_BRANCH } from './generated/o/index';
import { P_BRANCH } from './generated/p/index';
import { Q_BRANCH } from './generated/q/index';
import { R_BRANCH } from './generated/r/index';
import { S_BRANCH } from './generated/s/index';
import { T_BRANCH } from './generated/t/index';
import { U_BRANCH } from './generated/u/index';
import { V_BRANCH } from './generated/v/index';
import { X_BRANCH } from './generated/x/index';
import { Z_BRANCH } from './generated/z/index';

export const catalogRoots: CatalogNode[] = [
  A_BRANCH, B_BRANCH, C_BRANCH, D_BRANCH, E_BRANCH, F_BRANCH, G_BRANCH, H_BRANCH, I_BRANCH, J_BRANCH, K_BRANCH, N_BRANCH, O_BRANCH, P_BRANCH, Q_BRANCH, R_BRANCH, S_BRANCH, T_BRANCH, U_BRANCH, V_BRANCH, X_BRANCH, Z_BRANCH,
];

const flattenCatalogNodes = (nodes: CatalogNode[]): CatalogNode[] =>
  nodes.flatMap((node) => [node, ...(node.children ? flattenCatalogNodes(node.children) : [])]);

export const flatCatalogNodes = flattenCatalogNodes(catalogRoots);

export const catalogByCode = new Map(flatCatalogNodes.map((node) => [node.code, node]));

export const catalogBySlug = new Map(flatCatalogNodes.map((node) => [node.slug, node]));

export function getCatalogNodeByCode(code?: string | null) {
  if (!code) return undefined;
  return catalogByCode.get(code);
}

export function getCatalogNodeBySlug(slug?: string | null) {
  if (!slug) return undefined;
  return catalogBySlug.get(slug);
}

export function getCatalogPath(code?: string | null) {
  const path: CatalogNode[] = [];
  if (!code) return path;
  let current = catalogByCode.get(code);
  while (current) {
    path.unshift(current);
    current = current.parentCode ? catalogByCode.get(current.parentCode) : undefined;
  }
  return path;
}

export function getCatalogChildren(code?: string | null) {
  const node = getCatalogNodeByCode(code);
  return node?.children ?? [];
}

export function getDescendantCatalogCodes(code?: string | null): string[] {
  const node = getCatalogNodeByCode(code);
  if (!node) return [];
  return [node.code, ...(node.children ? node.children.flatMap((child) => getDescendantCatalogCodes(child.code)) : [])];
}

export function getTopLevelCatalogCode(code?: string | null) {
  return getCatalogPath(code)[0]?.code;
}

export function isCatalogDescendant(targetCode: string, ancestorCode: string) {
  return getCatalogPath(targetCode).some((node) => node.code === ancestorCode);
}
