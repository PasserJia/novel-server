import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InMemoryStore } from '../../store/in-memory.store';
import { Chapter } from '../../store/models';
import { QuanbenAdapter } from '../sources/quanben.adapter';
import { SearchNovelsDto } from './dto';

@Injectable()
export class NovelsService {
  constructor(
    private readonly store: InMemoryStore,
    private readonly quanben: QuanbenAdapter,
  ) {}

  async search(dto: SearchNovelsDto) {
    const source = dto.source ?? 'quanben';
    if (source !== 'quanben') {
      throw new BadRequestException('Unsupported source');
    }
    const keyword = dto.keyword.trim();
    if (!keyword) {
      throw new BadRequestException('Keyword is required');
    }

    try {
      return await this.quanben.search(keyword);
    } catch {
      throw new ServiceUnavailableException('搜索源暂时不可用，请稍后再试');
    }
  }

  async findNovel(id: number) {
    const novel = await this.store.findNovel(id);
    if (!novel) {
      throw new NotFoundException('Novel not found');
    }
    return novel;
  }

  async listChapters(id: number) {
    const novel = await this.findNovel(id);
    let chapters = await this.store.listChapters(id);
    // 首次进入时按需抓取目录并落库（稀疏跳读索引）
    if (chapters.length === 0 && novel.sourceCode === 'quanben') {
      try {
        const catalog = await this.quanben.fetchCatalog(novel.sourceNovelId);
        if (catalog.length > 0) {
          await this.store.replaceChapters(id, catalog);
          chapters = await this.store.listChapters(id);
        }
      } catch {
        throw new ServiceUnavailableException('目录源暂时不可用，请稍后再试');
      }
    }
    return chapters;
  }

  async findChapter(id: number) {
    const chapter = await this.store.findChapter(id);
    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }
    return this.hydrateChapter(chapter);
  }

  /** 顺序连读：按章节号取章节（目录外的章节会先建 stub 再回源），支持上一/下一章 */
  async getChapterByOrder(novelId: number, num: number) {
    const novel = await this.findNovel(novelId);
    if (novel.sourceCode !== 'quanben') {
      throw new BadRequestException('Unsupported source');
    }
    if (!Number.isInteger(num) || num < 1) {
      throw new BadRequestException('Invalid chapter number');
    }
    const stub = await this.store.ensureChapterStub(
      novelId,
      num,
      `第 ${num} 节`,
      `https://www.quanben.io/n/${novel.sourceNovelId}/${num}.html`,
    );
    return this.hydrateChapter(stub);
  }

  /** 正文按需抓取并缓存；返回时附上 prevNum/nextNum（站点章节号连续，按算术 + 目录最大号推导） */
  private async hydrateChapter(chapter: Chapter) {
    let current = chapter;
    if (!current.content) {
      const novel = await this.findNovel(current.novelId);
      const num = Number(current.sourceChapterId ?? current.chapterOrder);
      try {
        const fetched = await this.quanben.fetchChapter(novel.sourceNovelId, num);
        current =
          (await this.store.updateChapterContent(current.id, fetched.content, fetched.title)) ??
          current;
      } catch {
        throw new ServiceUnavailableException('正文源暂时不可用，请稍后再试');
      }
    }

    const order = current.chapterOrder;
    const chapters = await this.store.listChapters(current.novelId);
    const maxOrder = chapters.reduce((max, item) => Math.max(max, item.chapterOrder), order);
    return {
      ...current,
      prevNum: order > 1 ? order - 1 : null,
      nextNum: order < maxOrder ? order + 1 : null,
    };
  }
}
