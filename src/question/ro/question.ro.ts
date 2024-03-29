import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class QuestionStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  isMultipleChoice: boolean;
}

export class QuestionGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  isMultipleChoice: boolean;
}

export class QuestionGetListRO extends PaginateRO<QuestionGetListDataRO> {
  @ApiProperty({ type: [QuestionGetListDataRO] })
  @Type(() => QuestionGetListDataRO)
  @Expose()
  data: QuestionGetListDataRO[];
}

export class QuestionGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  isMultipleChoice: boolean;
}

export class QuestionUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  difficultyId: number;

  @ApiProperty()
  @Expose()
  isMultipleChoice: boolean;
}

export class QuestionDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}
