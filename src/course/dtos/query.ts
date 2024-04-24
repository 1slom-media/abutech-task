import { IsString } from 'class-validator';

export class QueryDto {
  @IsString()
  skip: string;

  @IsString()
  take: string;
}
