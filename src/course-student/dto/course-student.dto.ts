import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CourseStudentBulkStoreDTO {
  @ApiProperty({ type: [Number], example: [1] })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  courseIds: number[];

  @ApiProperty({ example: ['STU-001'] })
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  studentIds: string[];
}

export class CourseStudentBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  courseIds: number[];

  @ApiArrayProperty(SwaggerQueryParamStyle.CSV)
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  studentIds: string[];
}
