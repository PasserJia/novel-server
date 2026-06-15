import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class SaveReadingProgressDto {
  @IsOptional()
  @IsNumber()
  chapterId?: number;

  @IsOptional()
  @IsNumber()
  chapterOrder?: number;

  @IsOptional()
  @IsNumber()
  scrollPosition?: number;

  @IsOptional()
  @IsNumber()
  paragraphIndex?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  progressPercent: number;
}
