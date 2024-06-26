import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class S3UploadDataRO {
  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  size: string;
}

export class S3UploadRO {
  @ApiProperty({ type: [S3UploadDataRO] })
  @Type(() => S3UploadDataRO)
  @Expose()
  data: S3UploadDataRO[];
}
