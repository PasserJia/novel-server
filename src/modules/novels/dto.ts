import { IsString } from 'class-validator';

export class SearchNovelsDto {
  @IsString()
  keyword: string;
}
