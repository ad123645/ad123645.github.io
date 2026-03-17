import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const BLOG_DIR = path.resolve('src/content/blog');
const SHELF_DIR = path.resolve('src/content/shelves');
const CATALOG_DIR = path.resolve('src/data/catalog/generated');
const BLOG_REQUIRED_FIELDS = ['title', 'description', 'publishedAt', 'tags', 'draft', 'catalogCode'];
const SHELF_REQUIRED_FIELDS = ['title', 'description', 'shelfCode', 'featuredItems', 'draft'];
const RECORD_PATTERN = /\[\s*"((?:\\.|[^"\\])*)"\s*,\s*"((?:\\.|[^"\\])*)"\s*,\s*(null|"((?:\\.|[^"\\])*)")\s*,\s*\[(.*?)\]\s*\]/g;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (/\.(md|mdx|ts)$/i.test(entry.name)) {
      files.push(full);
    }
  }

  return files;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const raw = match[1];
  const data = {};

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf(':');
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!(key in data)) data[key] = value;
  }

  return data;
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, '').trim();
}

function loadCatalogCodes() {
  const files = walk(CATALOG_DIR).filter((file) => file.endsWith('.ts'));
  const codes = new Set();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    for (const match of content.matchAll(RECORD_PATTERN)) {
      codes.add(match[1]);
    }
  }

  return codes;
}

const catalogCodes = loadCatalogCodes();

function validateBlog(file) {
  const rel = path.relative(process.cwd(), file);
  const content = fs.readFileSync(file, 'utf8');
  const frontmatter = parseFrontmatter(content);
  const errors = [];

  if (!frontmatter) return [`${rel}: 缺少 frontmatter`];

  for (const field of BLOG_REQUIRED_FIELDS) {
    if (!(field in frontmatter)) errors.push(`${rel}: 缺少 ${field}`);
  }

  if ('title' in frontmatter && /^['"]?\s*['"]?$/.test(frontmatter.title)) errors.push(`${rel}: title 不能为空`);
  if ('description' in frontmatter && /^['"]?\s*['"]?$/.test(frontmatter.description)) errors.push(`${rel}: description 不能为空`);
  if ('draft' in frontmatter && !/^(true|false)$/i.test(frontmatter.draft)) errors.push(`${rel}: draft 必须是 true 或 false`);
  if ('catalogCode' in frontmatter) {
    const catalogCode = stripQuotes(frontmatter.catalogCode);
    if (!catalogCode) {
      errors.push(`${rel}: catalogCode 不能为空`);
    } else if (!catalogCodes.has(catalogCode)) {
      errors.push(`${rel}: catalogCode 不存在于当前目录树中 -> ${catalogCode}`);
    }
  }

  return errors;
}

function validateShelf(file) {
  const rel = path.relative(process.cwd(), file);
  const content = fs.readFileSync(file, 'utf8');
  const frontmatter = parseFrontmatter(content);
  const errors = [];

  if (!frontmatter) return [`${rel}: 缺少 frontmatter`];

  for (const field of SHELF_REQUIRED_FIELDS) {
    if (!(field in frontmatter)) errors.push(`${rel}: 缺少 ${field}`);
  }

  if ('title' in frontmatter && /^['"]?\s*['"]?$/.test(frontmatter.title)) errors.push(`${rel}: title 不能为空`);
  if ('description' in frontmatter && /^['"]?\s*['"]?$/.test(frontmatter.description)) errors.push(`${rel}: description 不能为空`);
  if ('shelfCode' in frontmatter && /^['"]?\s*['"]?$/.test(frontmatter.shelfCode)) errors.push(`${rel}: shelfCode 不能为空`);

  return errors;
}

const blogFiles = walk(BLOG_DIR).filter((file) => /\.(md|mdx)$/i.test(file));
const shelfFiles = walk(SHELF_DIR).filter((file) => /\.(md|mdx)$/i.test(file));
const errors = [
  ...blogFiles.flatMap(validateBlog),
  ...shelfFiles.flatMap(validateShelf),
];

if (errors.length) {
  console.error('内容检查未通过：\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`内容检查通过，共检查 ${blogFiles.length} 篇文章，${shelfFiles.length} 架专题书架。`);
console.log(`目录树索引已载入 ${catalogCodes.size} 个类号。`);
