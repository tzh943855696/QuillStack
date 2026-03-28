import fs from 'fs/promises';
import path from 'path';
import { readFileSync } from 'fs';

interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  author?: {
    name?: string;
  };
  seo?: {
    siteUrl?: string;
    rss?: {
      enabled?: boolean;
      title?: string;
      description?: string;
    };
  };
}

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentPath?: string;
  publishedAt: string;
  updatedAt?: string;
}

interface SiteDoc {
  articles: Article[];
}

function loadSettings(): SiteSettings {
  const content = readFileSync(path.join(process.cwd(), 'content/settings.json'), 'utf-8');
  return JSON.parse(content);
}

function loadArticles(): Article[] {
  const content = readFileSync(path.join(process.cwd(), 'content/sitedoc.json'), 'utf-8');
  const data: SiteDoc = JSON.parse(content);

  return data.articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822Date(dateString: string): string {
  return new Date(dateString).toUTCString();
}

function buildPostUrl(siteUrl: string, slug: string): string {
  return `${siteUrl.replace(/\/$/, '')}/posts/${slug}`;
}

function generateRssXml(siteUrl: string, settings: SiteSettings, articles: Article[]): string {
  const rssTitle = settings.seo?.rss?.title || `${settings.siteTitle} RSS`;
  const rssDescription = settings.seo?.rss?.description || settings.siteDescription;
  const siteTitle = settings.siteTitle;
  const authorName = settings.author?.name || siteTitle;
  const lastBuildDate = articles[0]?.updatedAt || articles[0]?.publishedAt || new Date().toISOString();

  const items = articles
    .map((article) => {
      const articleUrl = buildPostUrl(siteUrl, article.slug);
      const pubDate = article.updatedAt || article.publishedAt;

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid>${escapeXml(articleUrl)}</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <pubDate>${toRfc822Date(pubDate)}</pubDate>
      <author>${escapeXml(authorName)}</author>
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(rssTitle)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(rssDescription)}</description>
    <language>zh-cn</language>
    <generator>QuillStack</generator>
    <lastBuildDate>${toRfc822Date(lastBuildDate)}</lastBuildDate>${items}
  </channel>
</rss>`;
}

async function writeRssFile(filePath: string, content: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
}

async function main() {
  console.log('🚀 开始生成 RSS...\n');

  const settings = loadSettings();
  const rssConfig = settings.seo?.rss;

  if (rssConfig?.enabled === false) {
    console.log('⏭️  RSS 功能已禁用，跳过生成');
    return;
  }

  const siteUrl = settings.seo?.siteUrl;
  if (!siteUrl) {
    console.error('❌ 错误: 未配置站点 URL');
    console.error('   请在 settings.json 中设置 seo.siteUrl，例如: "https://example.com"');
    process.exit(1);
  }

  const articles = loadArticles();
  const rssXml = generateRssXml(siteUrl, settings, articles);

  const publicOutputPath = path.join(process.cwd(), 'public', 'rss.xml');
  const outOutputPath = path.join(process.cwd(), 'out', 'rss.xml');

  await Promise.all([
    writeRssFile(publicOutputPath, rssXml),
    writeRssFile(outOutputPath, rssXml),
  ]);

  console.log('✅ RSS 生成成功！');
  console.log(`   📄 public: ${publicOutputPath}`);
  console.log(`   📄 out: ${outOutputPath}`);
  console.log(`   📝 文章数量: ${articles.length}`);
}

main().catch((error) => {
  console.error('❌ 生成 RSS 时出错:', error);
  process.exit(1);
});
