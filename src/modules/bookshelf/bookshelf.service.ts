import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { InMemoryStore } from '../../store/in-memory.store';
import { AddBookshelfDto, ManualBookDto, UpdateBookshelfDto } from './dto';

const COVER_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

@Injectable()
export class BookshelfService {
  constructor(private readonly store: InMemoryStore) {}

  async list(userId: number) {
    return this.store.listBookshelf(userId);
  }

  async add(userId: number, dto: AddBookshelfDto) {
    const novel = await this.store.upsertNovel(dto);
    const item = await this.store.addBookshelfItem(userId, novel.id);
    return { ...item, novel };
  }

  async addManual(userId: number, dto: ManualBookDto) {
    const novel = await this.store.upsertNovel({
      title: dto.title,
      author: dto.author,
      sourceCode: 'manual',
      sourceNovelId: `${userId}:${dto.title}:${dto.author}`,
      sourceUrl: dto.sourceUrl,
    });
    const item = await this.store.addBookshelfItem(userId, novel.id);
    return { ...item, novel };
  }

  async update(userId: number, id: number, dto: UpdateBookshelfDto) {
    const item = await this.store.updateBookshelfItem(userId, id, dto);
    if (!item) {
      throw new NotFoundException('Bookshelf item not found');
    }
    return item;
  }

  async remove(userId: number, id: number) {
    if (!(await this.store.deleteBookshelfItem(userId, id))) {
      throw new NotFoundException('Bookshelf item not found');
    }
    return { success: true };
  }

  async setCover(
    userId: number,
    id: number,
    file: { buffer: Buffer; mimetype: string; originalname: string; size: number },
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('未收到图片文件');
    }
    const ext = COVER_EXT[file.mimetype];
    if (!ext) {
      throw new BadRequestException('只支持 JPG / PNG / GIF / WEBP 图片');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('图片不能超过 5MB');
    }

    const uploadsDir = join(process.cwd(), 'uploads');
    mkdirSync(uploadsDir, { recursive: true });
    const name = `cover-${userId}-${id}-${Date.now()}-${randomBytes(4).toString('hex')}${ext}`;
    writeFileSync(join(uploadsDir, name), file.buffer);

    const item = await this.store.updateBookshelfItem(userId, id, { customCoverUrl: `/uploads/${name}` });
    if (!item) {
      throw new NotFoundException('Bookshelf item not found');
    }
    return item;
  }
}
