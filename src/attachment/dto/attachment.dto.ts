import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { Type } from 'class-transformer';
import { IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class AttachmentStoreDTO {
  @ApiProperty({ type: [String], format: 'binary' })
  @MaxFileSize(3 * 1024 * 1024)
  @IsFile()
  file: MemoryStoredFile;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  lessonId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  assignmentId?: number;
}

export class AttachmentBulkStoreFileDTO {
  @ApiProperty({ example: 'https://example.com' })
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class AttachmentBulkStoreDTO {
  @ApiProperty({ type: [AttachmentBulkStoreFileDTO] })
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  @Type(() => AttachmentBulkStoreFileDTO)
  files: AttachmentBulkStoreFileDTO[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  lessonId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  assignmentId?: number;
}

export class AttachmentBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  ids: number[];
}

export class AttachmentGetListDTO extends PaginateDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  assignmentId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  lessonId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  createdBy?: number;
}

export class AttachmentGetDetailDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  assignmentId?: number;
}
