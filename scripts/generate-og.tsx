import fs from 'fs/promises';
import path from 'path';
import React from 'react';
import { ImageResponse } from '@vercel/og';
import { readFileSync } from 'fs';

// 站点配置类型
interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  header: {
    title: string;
    heroImageUrl: string;
  };
  author: {
    name: string;
    avatarUrl: string;
  };
  categories: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  seo?: {
    siteUrl: string;
    ogImageGenerationLimit: number;
    fallbackOgImage: string;
  };
  ogImage?: {
    slogan: string;
    primaryColor: string;
    backgroundColor: string;
    gradientEndColor: string;
    textColor: string;
    secondaryTextColor: string;
    tertiaryTextColor: string;
  };
}

// OG 图片配置默认值
const defaultOgConfig = {
  slogan: '技术 · 生活 · 分享',
  primaryColor: '#3b82f6',
  backgroundColor: '#0f172a',
  gradientEndColor: '#1e293b',
  textColor: '#f8fafc',
  secondaryTextColor: '#94a3b8',
  tertiaryTextColor: '#64748b',
};

// 获取 OG 配置（合并默认值）
function getOgConfig(settings: SiteSettings) {
  return { ...defaultOgConfig, ...settings.ogImage };
}

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  categoryId?: string;
  publishedAt: string;
}

// 读取配置文件
function loadSettings(): SiteSettings {
  const content = readFileSync(path.join(process.cwd(), 'content/settings.json'), 'utf-8');
  return JSON.parse(content);
}

function loadArticles(): Article[] {
  const content = readFileSync(path.join(process.cwd(), 'content/sitedoc.json'), 'utf-8');
  const data = JSON.parse(content);
  return data.articles.sort(
    (a: Article, b: Article) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// 生成首页 OG 图片
async function generateHomeOg(settings: SiteSettings, outputDir: string) {
  console.log('🏠 生成首页 OG 图片...');
  const ogConfig = getOgConfig(settings);

  const jsx = (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ogConfig.backgroundColor,
        backgroundImage: `linear-gradient(135deg, ${ogConfig.backgroundColor} 0%, ${ogConfig.gradientEndColor} 100%)`,
        padding: '40px 60px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <img
          src={settings.author.avatarUrl}
          width="80"
          height="80"
          style={{
            borderRadius: '50%',
            marginRight: '20px',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: ogConfig.textColor,
              marginBottom: '8px',
            }}
          >
            {settings.header.title}
          </span>
          <span style={{ fontSize: '24px', color: ogConfig.secondaryTextColor }}>
            {settings.author.name}
          </span>
        </div>
      </div>
      <h1
        style={{
          fontSize: '64px',
          fontWeight: 'bold',
          color: ogConfig.textColor,
          textAlign: 'center',
          marginBottom: '20px',
          maxWidth: '1000px',
        }}
      >
        {settings.siteTitle}
      </h1>
      <p
        style={{
          fontSize: '28px',
          color: ogConfig.secondaryTextColor,
          textAlign: 'center',
          maxWidth: '900px',
          lineHeight: 1.5,
        }}
      >
        {settings.siteDescription.slice(0, 100)}...
      </p>
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: ogConfig.primaryColor,
          }}
        />
        <span style={{ fontSize: '20px', color: ogConfig.tertiaryTextColor }}>
          {ogConfig.slogan}
        </span>
      </div>
    </div>
  );

  const image = new ImageResponse(jsx, {
    width: 1200,
    height: 630,
  });

  const buffer = await image.arrayBuffer();
  await fs.writeFile(path.join(outputDir, 'home.jpg'), Buffer.from(buffer));
  console.log('✅ 首页 OG 图片已生成');
}

// 生成分类页 OG 图片
async function generateCategoryOg(
  settings: SiteSettings,
  category: { id: string; name: string; color: string },
  outputDir: string
) {
  console.log(`📁 生成分类 "${category.name}" OG 图片...`);
  const ogConfig = getOgConfig(settings);

  const jsx = (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ogConfig.backgroundColor,
        backgroundImage: `linear-gradient(135deg, ${ogConfig.backgroundColor} 0%, ${ogConfig.gradientEndColor} 100%)`,
        padding: '40px 60px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '60px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <img
          src={settings.author.avatarUrl}
          width="40"
          height="40"
          style={{ borderRadius: '50%' }}
        />
        <span style={{ fontSize: '20px', color: ogConfig.secondaryTextColor }}>
          {settings.header.title}
        </span>
      </div>
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: category.color,
          marginBottom: '30px',
        }}
      />
      <h1
        style={{
          fontSize: '72px',
          fontWeight: 'bold',
          color: ogConfig.textColor,
          textAlign: 'center',
          marginBottom: '20px',
        }}
      >
        {category.name}
      </h1>
      <p style={{ fontSize: '28px', color: ogConfig.secondaryTextColor }}>文章分类</p>
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          display: 'flex',
          gap: '8px',
        }}
      >
        {settings.categories.slice(0, 4).map((cat) => (
          <div
            key={cat.id}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: cat.id === category.id ? cat.color : '#334155',
            }}
          />
        ))}
      </div>
    </div>
  );

  const image = new ImageResponse(jsx, {
    width: 1200,
    height: 630,
  });

  const buffer = await image.arrayBuffer();
  await fs.writeFile(
    path.join(outputDir, `category-${category.id}.jpg`),
    Buffer.from(buffer)
  );
  console.log(`✅ 分类 "${category.name}" OG 图片已生成`);
}

// 生成文章页 OG 图片
async function generateArticleOg(
  settings: SiteSettings,
  article: Article,
  categoryName: string | null,
  outputDir: string
) {
  console.log(`📝 生成文章 "${article.title}" OG 图片...`);
  const ogConfig = getOgConfig(settings);

  const jsx = (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: ogConfig.backgroundColor,
        backgroundImage: `linear-gradient(135deg, ${ogConfig.backgroundColor} 0%, ${ogConfig.gradientEndColor} 100%)`,
        padding: '50px 60px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={settings.author.avatarUrl}
          width="48"
          height="48"
          style={{ borderRadius: '50%' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '18px', color: ogConfig.textColor, fontWeight: 600 }}>
            {settings.author.name}
          </span>
          <span style={{ fontSize: '14px', color: ogConfig.tertiaryTextColor }}>
            {settings.header.title}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {categoryName && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: `rgba(59, 130, 246, 0.2)`,
              padding: '8px 16px',
              borderRadius: '20px',
              marginBottom: '20px',
              alignSelf: 'flex-start',
            }}
          >
            <span style={{ fontSize: '16px', color: '#60a5fa' }}>{categoryName}</span>
          </div>
        )}
        <h1
          style={{
            fontSize: '52px',
            fontWeight: 'bold',
            color: ogConfig.textColor,
            lineHeight: 1.3,
            maxWidth: '1000px',
          }}
        >
          {article.title.length > 40 ? article.title.slice(0, 40) + '...' : article.title}
        </h1>
        <p
          style={{
            fontSize: '22px',
            color: ogConfig.secondaryTextColor,
            marginTop: '16px',
            maxWidth: '900px',
            lineHeight: 1.5,
          }}
        >
          {article.excerpt.slice(0, 80)}...
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '16px', color: ogConfig.tertiaryTextColor }}>
          {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
        </span>
        <span style={{ color: '#475569' }}>·</span>
        <span style={{ fontSize: '16px', color: ogConfig.tertiaryTextColor }}>阅读文章</span>
      </div>
    </div>
  );

  const image = new ImageResponse(jsx, {
    width: 1200,
    height: 630,
  });

  const buffer = await image.arrayBuffer();
  await fs.writeFile(
    path.join(outputDir, `article-${article.slug}.jpg`),
    Buffer.from(buffer)
  );
  console.log(`✅ 文章 "${article.title}" OG 图片已生成`);
}

// 生成默认 OG 图片
async function generateDefaultOg(settings: SiteSettings, outputDir: string) {
  console.log('🖼️ 生成默认 OG 图片...');
  const ogConfig = getOgConfig(settings);

  const jsx = (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ogConfig.backgroundColor,
        backgroundImage: `linear-gradient(135deg, ${ogConfig.backgroundColor} 0%, ${ogConfig.gradientEndColor} 100%)`,
        padding: '40px 60px',
      }}
    >
      <img
        src={settings.author.avatarUrl}
        width="120"
        height="120"
        style={{ borderRadius: '50%', marginBottom: '30px' }}
      />
      <h1
        style={{
          fontSize: '56px',
          fontWeight: 'bold',
          color: ogConfig.textColor,
          textAlign: 'center',
          marginBottom: '16px',
        }}
      >
        {settings.siteTitle}
      </h1>
      <p style={{ fontSize: '24px', color: ogConfig.secondaryTextColor, textAlign: 'center' }}>
        {settings.header.title} · {ogConfig.slogan}
      </p>
    </div>
  );

  const image = new ImageResponse(jsx, {
    width: 1200,
    height: 630,
  });

  const buffer = await image.arrayBuffer();
  await fs.writeFile(path.join(outputDir, 'default.jpg'), Buffer.from(buffer));
  console.log('✅ 默认 OG 图片已生成');
}

// 主函数
async function main() {
  console.log('🚀 开始生成 OG 图片...\n');

  const settings = loadSettings();
  const articles = loadArticles();
  const limit = settings.seo?.ogImageGenerationLimit ?? 10;

  // 确保输出目录存在
  const outputDir = path.join(process.cwd(), 'public', 'og');
  await fs.mkdir(outputDir, { recursive: true });

  // 生成首页 OG
  await generateHomeOg(settings, outputDir);

  // 生成默认 OG
  await generateDefaultOg(settings, outputDir);

  // 为所有分类生成 OG（分类数量通常较少）
  console.log(`\n📁 开始生成分类 OG 图片 (${settings.categories.length} 个)...`);
  for (const category of settings.categories) {
    await generateCategoryOg(settings, category, outputDir);
  }

  // 为前 N 篇文章生成 OG
  const articlesToGenerate = articles.slice(0, limit);
  console.log(`\n📝 开始生成文章 OG 图片 (${articlesToGenerate.length} 篇, 限制: ${limit})...`);

  const categoriesMap = new Map(settings.categories.map((c) => [c.id, c.name]));

  for (const article of articlesToGenerate) {
    const categoryName = article.categoryId
      ? categoriesMap.get(article.categoryId) || null
      : null;
    await generateArticleOg(settings, article, categoryName, outputDir);
  }

  console.log(`\n✨ OG 图片生成完成！`);
  console.log(`   - 首页: 1 张`);
  console.log(`   - 默认: 1 张`);
  console.log(`   - 分类: ${settings.categories.length} 张`);
  console.log(`   - 文章: ${articlesToGenerate.length} 张 (超出限制的使用原有图片)`);
  console.log(`\n📂 输出目录: ${outputDir}`);
}

main().catch((error) => {
  console.error('❌ 生成 OG 图片时出错:', error);
  process.exit(1);
});
