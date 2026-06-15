import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddBookshelfDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsString()
  sourceCode: string;

  @IsString()
  sourceNovelId: string;

  @IsOptional()
  @IsString()
  sourceUrl?: string;
}

export class ManualBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  sourceUrl?: string;
}

export class UpdateBookshelfDto {
  @IsOptional()
  @IsString()
  customTitle?: string;

  @IsOptional()
  @IsString()
  customCoverUrl?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
