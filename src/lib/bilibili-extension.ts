import { marked, type TokenizerExtension, type RendererExtension, type TokenizerThis, type Tokens } from 'marked';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 450;

function extractBvid(url: string): string | null {
  const bvMatch = url.match(/\/video\/(BV[a-zA-Z0-9]+)/);
  if (bvMatch) {
    return bvMatch[1];
  }
  return null;
}

interface BilibiliToken extends Tokens.Generic {
  type: 'bilibili';
  url: string;
  bvid: string;
  width: number;
  height: number;
}

const bilibiliExtension: TokenizerExtension = {
  name: 'bilibili',
  level: 'inline',
  start(src: string) {
    return src.indexOf('@[bilibili]');
  },
  tokenizer(this: TokenizerThis, src: string): BilibiliToken | undefined {
    const rule = /^\@\[bilibili\]\(([^)\s]+)(?:\s*=(\d+)x(\d+))?\)/;
    const match = rule.exec(src);
    if (match) {
      const url = match[1];
      const bvid = extractBvid(url);
      
      if (!bvid) {
        return undefined;
      }
      
      const token: BilibiliToken = {
        type: 'bilibili',
        raw: match[0],
        url: url,
        bvid: bvid,
        width: match[2] ? parseInt(match[2], 10) : DEFAULT_WIDTH,
        height: match[3] ? parseInt(match[3], 10) : DEFAULT_HEIGHT,
      };
      return token;
    }
    return undefined;
  },
};

const bilibiliRenderer: RendererExtension = {
  name: 'bilibili',
  renderer(token: Tokens.Generic) {
    if (token.type === 'bilibili') {
      const bilibiliToken = token as BilibiliToken;
      const { bvid, width, height } = bilibiliToken;
      const playerUrl = `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1`;
      return `<div class="bilibili-video"><iframe src="${playerUrl}" width="${width}" height="${height}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe></div>`;
    }
    return false;
  },
};

export function setupMarkedWithBilibili() {
  marked.use({
    extensions: [bilibiliExtension, bilibiliRenderer],
  });
}

export { bilibiliExtension, bilibiliRenderer };
