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
const shelfCode = options.code?.trim() || 'S-XX';
const featuredPost = options.post?.trim() || 'first-reading-note';
const tone = options.tone?.trim() || '这一架还在整理中，可以先从几篇最核心的内容开始。';

if (!title) {
  console.error('请提供标题，例如：npm run new:shelf -- --title="建站与整理" --code=S-01 --post=astro-structure-note');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
  .replace(/^-+|-+$/g, '') || 'untitled-shelf';

const templatePath = path.resolve('templates/shelf.md');
const outputPath = path.resolve(`src/content/shelves/${slug}.md`);

if (!fs.existsSync(templatePath)) {
  console.error('未找到模板：templates/shelf.md');
  process.exit(1);
}

if (fs.existsSync(outputPath)) {
  console.error(`文件已存在：${path.relative(process.cwd(), outputPath)}`);
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');
const rendered = template
  .replaceAll('{{title}}', title)
  .replaceAll('{{description}}', `${title} 的展签说明还没写，可以先放一个工作说明。`)
  .replaceAll('{{shelfCode}}', shelfCode)
  .replaceAll('{{featuredPost}}', featuredPost)
  .replaceAll('{{tone}}', tone);

fs.writeFileSync(outputPath, rendered, 'utf8');
console.log(`已创建：${path.relative(process.cwd(), outputPath)}`);
