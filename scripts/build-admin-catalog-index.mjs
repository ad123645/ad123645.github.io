import fs from 'node:fs';
import path from 'node:path';

const GENERATED_DIR = path.resolve('src/data/catalog/generated');
const OUTPUT_FILE = path.resolve('.zhehen-admin/catalog-index.json');
const RECORD_PATTERN = /\[\s*"((?:\\.|[^"\\])*)"\s*,\s*"((?:\\.|[^"\\])*)"\s*,\s*(null|"((?:\\.|[^"\\])*)")\s*,\s*\[(.*?)\]\s*\]/gs;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.ts')) files.push(full);
  }
  return files.sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

function catalogMarker(code = '') {
  const raw = String(code || '').trim();
  if (raw.startsWith('[') && raw.endsWith(']')) return 'alternate';
  if (raw.startsWith('{') && raw.endsWith('}')) return 'deprecated';
  return 'normal';
}

function parseRecords() {
  const records = [];
  for (const file of walk(GENERATED_DIR)) {
    const content = fs.readFileSync(file, 'utf8');
    for (const match of content.matchAll(RECORD_PATTERN)) {
      const code = match[1].trim();
      const name = match[2].trim();
      const parentCode = match[3] === 'null' ? null : match[4].trim();
      const childCodes = [...match[5].matchAll(/"((?:\\.|[^"\\])*)"/g)].map((item) => item[1]);
      if (!code || !name) continue;
      records.push({ code, name, parentCode, childCodes, sourceFile: path.relative(process.cwd(), file) });
    }
  }
  return records;
}

function buildIndex(records) {
  const recordMap = new Map();
  for (const record of records) {
    if (!recordMap.has(record.code)) recordMap.set(record.code, record);
  }

  const childrenMap = new Map();
  for (const record of recordMap.values()) {
    const key = record.parentCode || '__root__';
    if (!childrenMap.has(key)) childrenMap.set(key, []);
    childrenMap.get(key).push(record.code);
  }

  const pathCache = new Map();
  function buildPath(code, seen = new Set()) {
    if (pathCache.has(code)) return pathCache.get(code);
    if (seen.has(code)) return [code];
    const record = recordMap.get(code);
    if (!record) return [code];
    const nextSeen = new Set(seen);
    nextSeen.add(code);
    const parentPath = record.parentCode && recordMap.has(record.parentCode)
      ? buildPath(record.parentCode, nextSeen)
      : [];
    const built = [...parentPath, code];
    pathCache.set(code, built);
    return built;
  }

  const nodes = [...recordMap.values()].map((record) => {
    const pathList = buildPath(record.code);
    const hasChildren = (childrenMap.get(record.code) || []).length > 0;
    const marker = catalogMarker(record.code);
    const isRange = record.code.includes('/');
    return {
      code: record.code,
      name: record.name,
      parentCode: record.parentCode,
      level: pathList.length,
      marker,
      isRange,
      hasChildren,
      childCount: (childrenMap.get(record.code) || []).length,
      path: pathList,
      pathText: pathList.join(' / '),
      searchText: `${record.code} ${record.name} ${pathList.join(' ')} ${marker}`.toLowerCase(),
    };
  }).sort((a, b) => a.code.localeCompare(b.code, 'zh-CN'));

  return {
    generatedAt: new Date().toISOString(),
    source: 'clc5-generated-ts',
    count: nodes.length,
    leafCount: nodes.filter((node) => !node.hasChildren).length,
    nodes,
  };
}

const records = parseRecords();
if (!records.length) {
  console.error('没有从 src/data/catalog/generated 读到分类记录。');
  process.exit(1);
}

const output = buildIndex(records);
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
console.log(`已生成管理台分类索引：${path.relative(process.cwd(), OUTPUT_FILE)}`);
console.log(`共 ${output.count} 个类号，${output.leafCount} 个叶子类目。`);
