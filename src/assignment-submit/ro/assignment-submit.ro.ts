import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class AssignmentSubmitGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  attachmentUrl: string;

  @ApiProperty()
  @Expose()
  attachmentName: string;

  @ApiProperty()
  @Expose()
  attachmentCreatedAt: Date;

  @ApiProperty()
  @Expose()
  attachmentCreatedBy: number;

  @ApiProperty()
  @Expose()
  studentName: string;

  @ApiProperty()
  @Expose()
  userImageUrl: string;

  @ApiProperty()
  @Expose()
  grade: number;
}

export class AssignmentSubmitGetListRO extends PaginateRO<AssignmentSubmitGetListDataRO> {
  @ApiProperty({ type: [AssignmentSubmitGetListDataRO] })
  @Type(() => AssignmentSubmitGetListDataRO)
  @Expose()
  data: AssignmentSubmitGetListDataRO[];
}

export class AssignmentSubmitGetStatisticRO {
  @ApiProperty()
  @Expose()
  submitCount: number;

  @ApiProperty()
  @Expose()
  correctCount: number;

  @ApiProperty()
  @Expose()
  lateCount: number;

  @ApiProperty()
  @Expose()
  missingCount: number;
}

export class AssignmentSubmitGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  createdBy: number;

  @ApiProperty()
  @Expose()
  assignmentCreatedBy: number;

  @ApiProperty()
  @Expose()
  attachmentUrl: string;

  @ApiProperty()
  @Expose()
  attachmentName: string;

  @ApiProperty()
  @Expose()
  studentName: string;

  @ApiProperty()
  @Expose()
  userImageUrl: string;
}

export class AssignmentSubmitGetGradeRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  grade: number;

  @ApiProperty()
  @Expose()
  assignmentSubmitId: number;
}
