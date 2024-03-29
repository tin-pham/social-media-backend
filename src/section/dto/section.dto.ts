import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class SectionStoreDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  courseId: number;
}

export class SectionGetListDTO extends PaginateDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  courseId: number;
}

export class SectionUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
}
