import { promises as fs } from 'fs';
import path from 'path';
import type { SiteSettings, Article, Category, FriendLinkSettings } from './types';

// This file uses 'fs' and 'path', so it should only be imported on the server.
// To use its functions on the client, you must wrap them in a client-side
// data-fetching hook (like useEffect) or pass the data as props from a
// Server Component.

// Helper function to get file paths
const getContentPath = (fileName: string) => path.join(process.cwd(), 'content', fileName);

// --- API 函数 ---

// 模拟API延迟
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function readJsonFile<T>(filePath: string): Promise<T> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await delay(50);
  const settings = await readJsonFile<SiteSettings>(getContentPath('settings.json'));
  return settings;
}

export async function getArticles(): Promise<Article[]> {
  await delay(50);
  const siteDocPath = getContentPath('sitedoc.json');
  const siteDoc = await readJsonFile<{ articles: Article[] }>(siteDocPath);
  const settings = await getSiteSettings();
  const categoriesById = new Map(settings.categories.map(cat => [cat.id, cat]));
  
  const articlesWithCategories = siteDoc.articles.map(article => {
    const category = article.categoryId ? categoriesById.get(article.categoryId) : undefined;
    return { ...article, category };
  });

  return articlesWithCategories.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getArticle(idOrSlug: string): Promise<Article | undefined> {
  await delay(50);
  const articles = await getArticles();
  const articleMeta = articles.find(a => a.id === idOrSlug || a.slug === idOrSlug);

  if (!articleMeta || !articleMeta.contentPath) {
    return undefined;
  }

  try {
    const content = await fs.readFile(path.join(process.cwd(), articleMeta.contentPath), 'utf-8');
    return {
      ...articleMeta,
      content,
    };
  } catch (error) {
    console.error(`Error reading article content for ${idOrSlug}:`, error);
    return undefined;
  }
}

export async function getCategory(slug: string): Promise<Category | undefined> {
    const settings = await getSiteSettings();
    return settings.categories.find(c => c.id === slug);
}

export async function getFriendLinks(): Promise<FriendLinkSettings> {
  await delay(50);
  return readJsonFile<FriendLinkSettings>(getContentPath('friends.json'));
}
