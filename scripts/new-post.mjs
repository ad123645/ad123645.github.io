import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const argv = process.argv.slice(2);
const options = Object.fromEntries(
  argv
    .map((item) => {
      const match = item.match(/^--([^=]+)=(.*)$/);
      return match ? [match[1], match[2]] : null;
    })
    .filter(Boolean)
);

const title = options.title?.trim();
const catalog = options.catalog?.trim() || 'Z4';
const tags = options.tags?.trim() || '随笔,草稿';
const templateName = options.template?.trim() || 'blog-post';

if (!title) {
  console.error('请提供标题，例如：npm run new:post -- --title="Astro 结构草稿" --catalog=TP --tags="Astro,前端"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
  .replace(/^-+|-+$/g, '') || 'untitled';

const today = new Date().toISOString().slice(0, 10);
const templatePath = path.resolve(`templates/${templateName}.md`);
const outputPath = path.resolve(`src/content/blog/${today}-${slug}.md`);

if (!fs.existsSync(templatePath)) {
  console.error(`未找到模板：templates/${templateName}.md`);
  process.exit(1);
}

if (fs.existsSync(outputPath)) {
  console.error(`文件已存在：${path.relative(process.cwd(), outputPath)}`);
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');
const rendered = template
  .replaceAll('{{title}}', title)
  .replaceAll('{{description}}', `${title} 的摘要还没写，可以先放一个工作说明。`)
  .replaceAll('{{publishedAt}}', today)
  .replaceAll('{{updatedAt}}', today)
  .replaceAll('{{catalogCode}}', catalog)
  .replaceAll('{{tags}}', tags
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `"${item}"`)
    .join(', ')
  );

fs.writeFileSync(outputPath, rendered, 'utf8');
console.log(`已创建：${path.relative(process.cwd(), outputPath)}`);
