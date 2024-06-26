import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from '../../common';
import { IsNotBlank } from 'src/common/decorator/validator/is-not-blank.validator';

const { NAME, CATEGORY_ID } = UNPROCESSABLE_ENTITY_EXCEPTION.COURSE;

export class CourseStoreDTO {
  @ApiProperty()
  @IsString({ message: NAME.FORMAT_IS_NOT_VALID })
  @IsNotBlank({}, { message: NAME.IS_NOT_EMPTY })
  name: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  description?: object;

  @ApiPropertyOptional({
    example: [1, 2, 3],
  })
  @IsNumber({}, { each: true, message: CATEGORY_ID.FORMAT_IS_NOT_VALID })
  @IsArray({ message: CATEGORY_ID.FORMAT_IS_NOT_VALID })
  @IsOptional()
  categoryIds?: number[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  levelId: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  hours: number;
}

export class CourseGetListDTO extends PaginateDTO {
  @ApiPropertyOptional({ example: 1 })
  @IsString()
  @IsOptional()
  userId?: number;

  @ApiPropertyOptional({ example: 1 })
  @Transform(({ value }) => (value === 'null' ? null : value))
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  withAssignmentCount?: boolean;
}

export class CourseTeacherGetListDTO extends PaginateDTO {}

export class CourseGetDetailDTO {
  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsOptional()
  withCategoryIds?: boolean;
}

export class CourseUpdateDTO {
  @ApiPropertyOptional()
  @IsString({ message: NAME.FORMAT_IS_NOT_VALID })
  @IsNotBlank({}, { message: NAME.IS_NOT_EMPTY })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  description?: object;

  @ApiPropertyOptional({ example: [1] })
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  categoryIds: number[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  levelId: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  hours?: number;
}
