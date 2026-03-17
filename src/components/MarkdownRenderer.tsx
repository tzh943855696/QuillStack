import { marked } from 'marked';

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const htmlContent = marked(content || '', { gfm: true });

  return (
    <div
      className="prose dark:prose-invert prose-headings:font-headline max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent as string }}
    />
  );
}
