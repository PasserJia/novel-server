import { IsEmail, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @ValidateIf((dto: RegisterDto) => !dto.email)
  @IsString()
  phone?: string;

  @ValidateIf((dto: RegisterDto) => !dto.phone)
  @IsEmail()
  email?: string;
}

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class ResetPasswordDto {
  @IsString()
  username: string;

  @IsString()
  contact: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
