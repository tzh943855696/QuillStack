import { marked, type Tokens } from 'marked';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

function stripMarkdownInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim();
}

export function createHeadingId(text: string): string {
  const normalizedText = stripMarkdownInline(text);

  return normalizedText
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section';
}

export function extractHeadings(content: string): TOCItem[] {
  const slugCounts = new Map<string, number>();

  return marked
    .lexer(content || '', { gfm: true })
    .filter(
      (token): token is Tokens.Heading =>
        token.type === 'heading' && token.depth >= 1 && token.depth <= 6
    )
    .map((token) => {
      const text = stripMarkdownInline(token.text);
      const baseId = createHeadingId(token.text);
      const seenCount = slugCounts.get(baseId) ?? 0;
      slugCounts.set(baseId, seenCount + 1);
      const id = seenCount === 0 ? baseId : `${baseId}-${seenCount + 1}`;

      return {
        id,
        text,
        level: token.depth,
      };
    });
}
