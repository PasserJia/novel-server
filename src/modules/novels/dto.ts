import { IsOptional, IsString } from 'class-validator';

export class SearchNovelsDto {
  @IsString()
  keyword: string;

  @IsOptional()
  @IsString()
  source?: string;
}
