import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const CATALOG_DIR = path.resolve('src/data/catalog/generated');
const RECORD_PATTERN = /\[\s*"((?:\\.|[^"\\])*)"\s*,\s*"((?:\\.|[^"\\])*)"\s*,\s*(null|"((?:\\.|[^"\\])*)")\s*,\s*\[(.*?)\]\s*\]/g;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.ts')) files.push(full);
  }
  return files;
}

function parseRecords() {
  const records = [];
  for (const file of walk(CATALOG_DIR)) {
    const content = fs.readFileSync(file, 'utf8');
    for (const match of content.matchAll(RECORD_PATTERN)) {
      const code = match[1];
      const name = match[2];
      const parentCode = match[3] === 'null' ? null : match[4];
      const childCodes = [...match[5].matchAll(/"((?:\\.|[^"\\])*)"/g)].map((item) => item[1]);
      records.push({ file, code, name, parentCode, childCodes });
    }
  }
  return records;
}

const records = parseRecords();
const recordMap = new Map();
const duplicateCodes = [];

for (const record of records) {
  if (recordMap.has(record.code)) {
    duplicateCodes.push(record.code);
    continue;
  }
  recordMap.set(record.code, record);
}

const errors = [];
for (const code of duplicateCodes) {
  errors.push(`重复类号: ${code}`);
}

let looseReferenceCount = 0;
for (const record of recordMap.values()) {
  if (record.parentCode && !recordMap.has(record.parentCode)) {
    errors.push(`缺少上位类: ${record.code} -> ${record.parentCode}`);
  }

  for (const childCode of record.childCodes) {
    const child = recordMap.get(childCode);
    if (!child) {
      errors.push(`缺少下位类定义: ${record.code} -> ${childCode}`);
      continue;
    }
    if (child.parentCode !== record.code) {
      looseReferenceCount += 1;
    }
  }
}

if (errors.length) {
  console.error('目录校验未通过：\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const leafCount = [...recordMap.values()].filter((record) => record.childCodes.length === 0).length;
console.log(`目录校验通过：${recordMap.size} 个类号，${leafCount} 个叶子类目。`);
console.log(`已检测到 ${looseReferenceCount} 处宽松下位引用，它们不会影响 buildCatalogRoot 的建树结果。`);
