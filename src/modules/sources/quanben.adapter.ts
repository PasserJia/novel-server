import { Injectable } from '@nestjs/common';

export interface QuanbenSearchResult {
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  sourceCode: 'quanben';
  sourceNovelId: string;
  sourceUrl: string;
}

export interface QuanbenCatalogEntry {
  num: number;
  title: string;
  sourceUrl: string;
}

export interface QuanbenChapter {
  title: string;
  content: string;
  prevNum: number | null;
  nextNum: number | null;
}

/**
 * quanben.io 适配器。站点页面是 schema.org 微数据（UTF-8），结构规整，
 * 这里用原生 fetch + 针对性正则解析，不引入第三方 HTML 解析依赖。
 *
 * - 搜索:   /index.php?c=book&a=search&keywords={词}   → .list2 块
 * - 目录:   /n/{slug}/list.html                        → ul.list3 li a（稀疏跳读索引）
 * - 正文:   /n/{slug}/{num}.html                        → h1.headline + div[itemprop=articleBody] 内的 <p>
 *           翻页靠章节页自带的 a[rel=prev] / a[rel=next]
 */
@Injectable()
export class QuanbenAdapter {
  private readonly base = 'https://www.quanben.io';

  async search(keyword: string): Promise<QuanbenSearchResult[]> {
    const html = await this.httpGet(
      `${this.base}/index.php?c=book&a=search&keywords=${encodeURIComponent(keyword)}`,
    );

    const results: QuanbenSearchResult[] = [];
    const seen = new Set<string>();
    // 每本书是一个 class="list2" 块
    const blocks = html.split('class="list2"').slice(1);
    for (const block of blocks) {
      const slugMatch = block.match(/href="\/n\/([^"/]+)\/"/);
      const titleMatch = block.match(/itemprop="name"[^>]*>([^<]+)</);
      if (!slugMatch || !titleMatch) continue;

      const slug = slugMatch[1];
      if (seen.has(slug)) continue;
      seen.add(slug);

      const authorMatch = block.match(/itemprop="author"[^>]*>([^<]+)</);
      const descMatch = block.match(/itemprop="description"[^>]*>([^<]*)</);
      const coverMatch = block.match(/<img[^>]+src="([^"]+)"/);

      results.push({
        title: this.clean(titleMatch[1]),
        author: authorMatch ? this.clean(authorMatch[1]) : '佚名',
        description: descMatch ? this.clean(descMatch[1]) || undefined : undefined,
        coverUrl: coverMatch ? this.normalizeUrl(coverMatch[1]) : undefined,
        sourceCode: 'quanben',
        sourceNovelId: slug,
        sourceUrl: `${this.base}/n/${slug}/`,
      });
      if (results.length >= 40) break;
    }
    return results;
  }

  async fetchCatalog(slug: string): Promise<QuanbenCatalogEntry[]> {
    const listHtml = await this.httpGet(`${this.base}/n/${slug}/list.html`);
    const map = new Map<number, QuanbenCatalogEntry>();
    this.collectChapters(slug, listHtml, map);

    // list.html 只含首尾少量章节，其余（绝大部分）通过站点自己的 load_more JSONP 一次返回
    const bookId = (listHtml.match(/load_more\('?(\d+)'?\)/) || [])[1];
    const callback = (listHtml.match(/var\s+callback\s*=\s*'([^']+)'/) || [])[1];
    if (bookId && callback) {
      try {
        const jsonp = await this.httpGet(
          `${this.base}/index.php?c=book&a=list.jsonp&callback=${callback}&book_id=${bookId}&b=${this.obfuscate(callback)}`,
          `${this.base}/n/${slug}/list.html`,
        );
        const start = jsonp.indexOf('(');
        const end = jsonp.lastIndexOf(')');
        if (start >= 0 && end > start) {
          const data = JSON.parse(jsonp.slice(start + 1, end));
          this.collectChapters(slug, String(data.content || ''), map);
        }
      } catch {
        // JSONP 拿不到时退回 list.html 的部分目录，不致命
      }
    }
    return Array.from(map.values()).sort((a, b) => a.num - b.num);
  }

  private collectChapters(
    slug: string,
    html: string,
    out: Map<number, QuanbenCatalogEntry>,
  ): void {
    const re =
      /href="\/n\/[^"/]+\/(\d+)\.html"[^>]*>\s*<span[^>]*itemprop="name"[^>]*>([^<]+)<\/span>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      const num = Number(m[1]);
      if (!Number.isFinite(num) || out.has(num)) continue;
      out.set(num, {
        num,
        title: this.clean(m[2]),
        sourceUrl: `${this.base}/n/${slug}/${num}.html`,
      });
    }
  }

  /**
   * 复刻 quanben list.html 内联的 base64()：每个字符在固定表里 +3，左右各补一个占位符。
   * 服务端只取中间字符（位置 1,4,7…）反推校验，故占位符用表首字符即可。
   */
  private obfuscate(input: string): string {
    const sc = 'PXhw7UT1B0a9kQDKZsjIASmOezxYG4CHo5Jyfg2b8FLpEvRr3WtVnlqMidu6cN';
    let out = '';
    for (const ch of input) {
      const i = sc.indexOf(ch);
      const code = i === -1 ? ch : sc[(i + 3) % 62];
      out += sc[0] + code + sc[0];
    }
    return out;
  }

  async fetchChapter(slug: string, num: number): Promise<QuanbenChapter> {
    const html = await this.httpGet(`${this.base}/n/${slug}/${num}.html`);

    const titleMatch =
      html.match(/<h1[^>]*itemprop="headline"[^>]*>([^<]+)<\/h1>/) ||
      html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleMatch ? this.clean(titleMatch[1]) : `第 ${num} 节`;

    // 把解析范围限定在正文区块内，避免抓到页脚/推荐区的 <p>
    let region = html;
    const bodyIdx = html.search(/itemprop="articleBody"/);
    if (bodyIdx >= 0) {
      region = html.slice(bodyIdx);
      const endIdx = region.search(/<script|id="footer"|class="footer"/i);
      if (endIdx >= 0) region = region.slice(0, endIdx);
    }

    const paragraphs: string[] = [];
    const pRe = /<p[^>]*>([\s\S]*?)<\/p>/g;
    let pm: RegExpExecArray | null;
    while ((pm = pRe.exec(region)) !== null) {
      const text = this.clean(this.stripTags(pm[1]));
      if (text) paragraphs.push(text);
    }
    // 正文首段常常重复章节标题（如「第一章 …」），去掉以免和上方标题重复
    if (
      paragraphs.length > 1 &&
      paragraphs[0].length < 30 &&
      /^第[\d一二三四五六七八九十百千零两]+[章节回]/.test(paragraphs[0])
    ) {
      paragraphs.shift();
    }

    return {
      title,
      content: paragraphs.join('\n'),
      prevNum: this.relNum(html, 'prev'),
      nextNum: this.relNum(html, 'next'),
    };
  }

  private relNum(html: string, rel: 'prev' | 'next'): number | null {
    const tag = html.match(new RegExp(`<a\\s[^>]*rel="${rel}"[^>]*>`, 'i'));
    if (!tag) return null;
    const href = tag[0].match(/\/n\/[^"/]+\/(\d+)\.html/);
    return href ? Number(href[1]) : null;
  }

  private async httpGet(url: string, referer?: string): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9',
          'Accept-Language': 'zh-CN,zh;q=0.9',
          Referer: referer ?? `${this.base}/`,
        },
      });
      if (!res.ok) {
        throw new Error(`quanben.io 返回状态 ${res.status}`);
      }
      return await res.text();
    } finally {
      clearTimeout(timer);
    }
  }

  private normalizeUrl(url: string): string {
    if (url.startsWith('//')) return `https:${url}`;
    return url;
  }

  private stripTags(html: string): string {
    return html.replace(/<[^>]+>/g, '');
  }

  private clean(text: string): string {
    return this.decodeEntities(text).replace(/\s+/g, ' ').trim();
  }

  private decodeEntities(text: string): string {
    return text
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
      .replace(/&amp;/g, '&');
  }
}
