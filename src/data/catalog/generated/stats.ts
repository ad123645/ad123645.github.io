export const CATALOG_TOTAL_NODES = 45785;
export const CATALOG_TOTAL_LEAF_NODES = 37105;
export const CATALOG_TOTAL_RANGE_CODES = 151;
export const CATALOG_MARKER_COUNTS = {
  normal: 44415,
  alternate: 1110,
  deprecated: 260,
} as const;

export const CATALOG_ROOT_STATS = [
  { rootCode: 'A', nodeCount: 139, leafCount: 108 },
  { rootCode: 'B', nodeCount: 755, leafCount: 611 },
  { rootCode: 'C', nodeCount: 214, leafCount: 175 },
  { rootCode: 'D', nodeCount: 1125, leafCount: 915 },
  { rootCode: 'E', nodeCount: 431, leafCount: 360 },
  { rootCode: 'F', nodeCount: 1571, leafCount: 1268 },
  { rootCode: 'G', nodeCount: 1431, leafCount: 1140 },
  { rootCode: 'H', nodeCount: 523, leafCount: 439 },
  { rootCode: 'I', nodeCount: 304, leafCount: 251 },
  { rootCode: 'J', nodeCount: 969, leafCount: 783 },
  { rootCode: 'K', nodeCount: 2020, leafCount: 1624 },
  { rootCode: 'N', nodeCount: 96, leafCount: 80 },
  { rootCode: 'O', nodeCount: 2054, leafCount: 1605 },
  { rootCode: 'P', nodeCount: 2311, leafCount: 1866 },
  { rootCode: 'Q', nodeCount: 3468, leafCount: 2789 },
  { rootCode: 'R', nodeCount: 3735, leafCount: 3017 },
  { rootCode: 'S', nodeCount: 4646, leafCount: 3797 },
  { rootCode: 'T', nodeCount: 14741, leafCount: 12073 },
  { rootCode: 'U', nodeCount: 3512, leafCount: 2814 },
  { rootCode: 'V', nodeCount: 1322, leafCount: 1059 },
  { rootCode: 'X', nodeCount: 316, leafCount: 252 },
  { rootCode: 'Z', nodeCount: 102, leafCount: 79 },
] as const;

export const CATALOG_GENERATION_NOTE = `本目录树根据结构化中图分类数据生成，并结合你上传的《中国图书馆分类法（第五版）》做抽样核对。`;
