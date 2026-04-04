import { marked } from 'marked';
import { extractHeadings } from '@/lib/toc';

const DEFAULT_BILIBILI_WIDTH = 668;
const DEFAULT_BILIBILI_HEIGHT = 376;

const bilibiliRenderer = {
  image({ href, title, text }: { href: string; title: string | null; text: string }): string {
    // 检查是否是B站视频链接
    const bilibiliRegex = /^(https?:\/\/)?(www\.)?bilibili\.com\/video\/(BV[\w]+)/i;
    const match = href.match(bilibiliRegex);

    if (match) {
      const bvid = match[3];

      // 解析尺寸参数，格式: URL =500x281
      let width = DEFAULT_BILIBILI_WIDTH;
      let height = DEFAULT_BILIBILI_HEIGHT;

      // 检查href中是否包含尺寸参数（通过空格分隔）
      const sizeMatch = href.match(/\s+=(\d+)x(\d+)$/);
      if (sizeMatch) {
        width = parseInt(sizeMatch[1], 10);
        height = parseInt(sizeMatch[2], 10);
      }

      // 构建B站播放器URL
      const playerUrl = `//player.bilibili.com/player.html?isOutside=true&bvid=${bvid}&p=1&autoplay=0`;

      return `<iframe src="${playerUrl}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="${width}" height="${height}"></iframe>`;
    }

    // 非B站链接，使用默认图片渲染
    const titleAttr = title ? ` title="${title}"` : '';
    const altAttr = text ? ` alt="${text}"` : '';
    return `<img src="${href}"${titleAttr}${altAttr} />`;
  },
};

// 注册自定义renderer
marked.use({ renderer: bilibiliRenderer });

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const markdownContent = content || '';
  const headings = extractHeadings(markdownContent);
  const htmlContent = marked.parse(markdownContent, { gfm: true }) as string;

  let headingIndex = 0;
  const htmlWithHeadingIds = htmlContent.replace(
    /<h([1-6])>([\s\S]*?)<\/h\1>/g,
    (match, level, innerHtml) => {
      const heading = headings[headingIndex++];

      if (!heading) {
        return match;
      }

      return `<h${level} id="${heading.id}">${innerHtml}</h${level}>`;
    }
  );

  return (
    <div
      className="prose dark:prose-invert prose-headings:font-headline max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlWithHeadingIds }}
    />
  );
}
