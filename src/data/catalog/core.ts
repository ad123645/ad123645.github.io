export type CatalogMarker = 'normal' | 'alternate' | 'deprecated';

export interface CatalogNode {
  code: string;
  name: string;
  slug: string;
  level: number;
  parentCode?: string;
  note?: string;
  marker?: CatalogMarker;
  isRange?: boolean;
  children?: CatalogNode[];
}

export type CatalogSourceRecord = [
  code: string,
  name: string,
  parentCode: string | null,
  childCodes: string[],
];

export const makeSlug = (code: string) =>
  code
    .toLowerCase()
    .replace(/[\[\]{}()（）]/g, '')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');

export const inferCatalogMarker = (code: string): CatalogMarker => {
  if (code.startsWith('{')) return 'deprecated';
  if (code.startsWith('[')) return 'alternate';
  return 'normal';
};

export const inferCatalogRange = (code: string) => code.includes('/');

export const leaf = (
  code: string,
  name: string,
  level: number,
  parentCode: string,
  note?: string,
): CatalogNode => ({
  code,
  name,
  slug: makeSlug(code),
  level,
  parentCode,
  marker: inferCatalogMarker(code),
  ...(inferCatalogRange(code) ? { isRange: true } : {}),
  ...(note ? { note } : {}),
});

export const branch = (
  code: string,
  name: string,
  level: number,
  parentCode: string | undefined,
  children: CatalogNode[],
  note?: string,
): CatalogNode => ({
  code,
  name,
  slug: makeSlug(code),
  level,
  marker: inferCatalogMarker(code),
  ...(inferCatalogRange(code) ? { isRange: true } : {}),
  ...(parentCode ? { parentCode } : {}),
  ...(note ? { note } : {}),
  children,
});

const flattenHierarchySourceNodes = (node: CatalogNode): CatalogNode[] => [
  {
    code: node.code,
    name: node.name,
    slug: node.slug,
    level: node.level,
    ...(node.parentCode ? { parentCode: node.parentCode } : {}),
    ...(node.note ? { note: node.note } : {}),
    ...(node.marker ? { marker: node.marker } : {}),
    ...(node.isRange ? { isRange: true } : {}),
  },
  ...((node.children ?? []).flatMap(flattenHierarchySourceNodes)),
];

const normalizeCode = (code: string) => code.replace(/[\[\]{}()（）]/g, '');

const buildHierarchyPath = (code: string): string[] => {
  const normalized = normalizeCode(code);
  const match = normalized.match(/^([A-Z]+)(.*)$/i);
  if (!match) return [normalized];

  const [, prefix, rest] = match;
  const path = [prefix];
  let current = prefix;
  let pendingSeparator = '';

  for (const char of rest) {
    if (char === '-' || char === '.') {
      pendingSeparator = char;
      continue;
    }

    current += `${pendingSeparator}${char}`;
    pendingSeparator = '';
    path.push(current);
  }

  return path;
};

const compareCatalogCode = (left: string, right: string) =>
  normalizeCode(left).localeCompare(normalizeCode(right), 'zh-Hans-CN');

export const rebuildCatalogHierarchy = (root: CatalogNode): CatalogNode => {
  const uniqueNodes = new Map<string, CatalogNode>();

  for (const node of flattenHierarchySourceNodes(root)) {
    uniqueNodes.set(normalizeCode(node.code), {
      code: node.code,
      name: node.name,
      slug: makeSlug(node.code),
      level: 1,
      marker: inferCatalogMarker(node.code),
      ...(inferCatalogRange(node.code) ? { isRange: true } : {}),
      ...(node.note ? { note: node.note } : {}),
    });
  }

  const treeNodes = new Map<string, CatalogNode>();
  for (const [normalizedCode, node] of uniqueNodes.entries()) {
    treeNodes.set(normalizedCode, {
      ...node,
      children: [],
    });
  }

  const sortedCodes = [...treeNodes.keys()].sort(compareCatalogCode);

  for (const normalizedCode of sortedCodes) {
    const node = treeNodes.get(normalizedCode)!;
    const hierarchyPath = buildHierarchyPath(node.code).map(normalizeCode);
    node.level = hierarchyPath.length as number;

    if (hierarchyPath.length === 1) {
      delete node.parentCode;
      continue;
    }

    const parentNormalizedCode = hierarchyPath[hierarchyPath.length - 2];
    const parent = treeNodes.get(parentNormalizedCode);
    node.parentCode = parent?.code ?? parentNormalizedCode;

    if (parent) {
      parent.children = parent.children ?? [];
      if (!parent.children.some((child) => normalizeCode(child.code) === normalizedCode)) {
        parent.children.push(node);
      }
    }
  }

  const sortChildren = (node: CatalogNode): CatalogNode => {
    if (!node.children || node.children.length === 0) {
      delete node.children;
      return node;
    }

    node.children = node.children
      .sort((a, b) => compareCatalogCode(a.code, b.code))
      .map(sortChildren);

    return node;
  };

  return sortChildren(treeNodes.get(normalizeCode(root.code))!);
};

export const buildCatalogRoot = (
  records: CatalogSourceRecord[],
  rootCode: string,
): CatalogNode => {
  const recordMap = new Map(records.map((record) => [record[0], record]));
  const levelMemo = new Map<string, number>();

  const getLevel = (code: string): number => {
    if (levelMemo.has(code)) return levelMemo.get(code)!;
    const record = recordMap.get(code);
    if (!record) {
      throw new Error(`Catalog record missing: ${code}`);
    }

    const parentCode = record[2];
    const level = parentCode ? getLevel(parentCode) + 1 : 1;
    levelMemo.set(code, level);
    return level;
  };

  const visit = (code: string): CatalogNode => {
    const record = recordMap.get(code);
    if (!record) {
      throw new Error(`Catalog record missing: ${code}`);
    }

    const [currentCode, name, parentCode, childCodes] = record;
    const orderedDirectChildren = childCodes.filter((childCode) => {
      const childRecord = recordMap.get(childCode);
      return childRecord?.[2] === currentCode;
    });
    const children = orderedDirectChildren.map((childCode) => visit(childCode));

    return {
      code: currentCode,
      name,
      slug: makeSlug(currentCode),
      level: getLevel(currentCode),
      marker: inferCatalogMarker(currentCode),
      ...(inferCatalogRange(currentCode) ? { isRange: true } : {}),
      ...(parentCode ? { parentCode } : {}),
      ...(children.length ? { children } : {}),
    };
  };

  return visit(rootCode);
};
