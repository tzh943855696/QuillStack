import fs from 'fs/promises';
import path from 'path';
import { readFileSync } from 'fs';

// 站点配置类型
interface SiteSettings {
  seo?: {
    siteUrl: string;
  };
  sitemap?: {
    enabled?: boolean;
    changefreq?: string;
    priority?: number;
  };
  categories: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

// 文章类型
interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  categoryId?: string;
  publishedAt: string;
  updatedAt?: string;
}

// SiteDoc 类型
interface SiteDoc {
  articles: Article[];
}

// 读取配置文件
function loadSettings(): SiteSettings {
  const content = readFileSync(path.join(process.cwd(), 'content/settings.json'), 'utf-8');
  return JSON.parse(content);
}

// 读取文章数据
function loadArticles(): Article[] {
  const content = readFileSync(path.join(process.cwd(), 'content/sitedoc.json'), 'utf-8');
  const data: SiteDoc = JSON.parse(content);
  return data.articles.sort(
    (a: Article, b: Article) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// 格式化日期为 ISO 8601 格式
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}

// 生成 sitemap XML
function generateSitemap(
  siteUrl: string,
  articles: Article[],
  categories: SiteSettings['categories'],
  settings: SiteSettings
): string {
  const sitemapConfig = settings.sitemap || {};
  const changefreq = sitemapConfig.changefreq || 'weekly';
  const priority = sitemapConfig.priority ?? 0.7;

  const urls: string[] = [];

  // 首页
  urls.push(`
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  // 分类列表页
  urls.push(`
  <url>
    <loc>${siteUrl}/category</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>0.8</priority>
  </url>`);

  // 各分类页
  for (const category of categories) {
    urls.push(`
  <url>
    <loc>${siteUrl}/category/${category.id}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>0.6</priority>
  </url>`);
  }

  // 友链页
  urls.push(`
  <url>
    <loc>${siteUrl}/friends</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>0.5</priority>
  </url>`);

  // 文章页
  for (const article of articles) {
    const lastmod = article.updatedAt || article.publishedAt;
    urls.push(`
  <url>
    <loc>${siteUrl}/posts/${article.slug}</loc>
    <lastmod>${formatDate(lastmod)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`;
}

// 主函数
async function main() {
  console.log('🚀 开始生成 sitemap...\n');

  // 读取配置
  const settings = loadSettings();

  // 检查是否启用 sitemap
  const sitemapConfig = settings.sitemap || {};
  if (!sitemapConfig.enabled) {
    console.log('⏭️  sitemap 功能已禁用，跳过生成');
    console.log('   提示: 在 settings.json 中设置 sitemap.enabled 为 true 以启用');
    return;
  }

  // 获取站点 URL
  const siteUrl = settings.seo?.siteUrl;
  if (!siteUrl) {
    console.error('❌ 错误: 未配置站点 URL');
    console.error('   请在 settings.json 中设置 seo.siteUrl，例如: "https://example.com"');
    process.exit(1);
  }

  // 读取文章数据
  const articles = loadArticles();

  console.log(`📊 找到 ${articles.length} 篇文章`);
  console.log(`🌐 站点 URL: ${siteUrl}`);
  console.log(`⚙️  changefreq: ${sitemapConfig.changefreq || 'weekly'}`);
  console.log(`⚙️  priority: ${sitemapConfig.priority ?? 0.7}`);
  console.log('');

  // 生成 sitemap XML
  const sitemapXml = generateSitemap(siteUrl, articles, settings.categories, settings);

  // 输出到 out 目录（构建后的根目录）
  const outputDir = path.join(process.cwd(), 'out');
  await fs.mkdir(outputDir, { recursive: true });

  // 写入文件
  const outputPath = path.join(outputDir, 'sitemap.xml');
  await fs.writeFile(outputPath, sitemapXml, 'utf-8');

  // 同时写入 public 目录（开发环境使用）
  const publicDir = path.join(process.cwd(), 'public');
  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');

  // 统计 URL 数量
  const urlCount = (sitemapXml.match(/<url>/g) || []).length;

  console.log('✅ sitemap 生成成功！');
  console.log(`   📄 文件路径: ${outputPath}`);
  console.log(`   🔗 URL 数量: ${urlCount}`);
}

main().catch((error) => {
  console.error('❌ 生成 sitemap 时出错:', error);
  process.exit(1);
});
