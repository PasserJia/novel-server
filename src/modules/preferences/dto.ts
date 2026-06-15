import { IsObject, IsOptional } from 'class-validator';

export class SavePreferencesDto {
  @IsOptional()
  @IsObject()
  bookshelfTheme?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  tabbarTheme?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  readerTheme?: Record<string, unknown>;
}
