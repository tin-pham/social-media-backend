import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class UserStoreRO {
  @ApiProperty({ example: 'tinpham' })
  @Expose()
  username: string;

  @ApiProperty({ required: false, example: 'tinpham@example.com' })
  @Expose()
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  @Expose()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @Expose()
  displayName: string;
}

export class UserGetDetailRoleRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class UserGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ example: 'tinpham' })
  @Expose()
  username: string;

  @ApiProperty({ required: false, example: 'tinpham@example.com' })
  @Expose()
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  @Expose()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @Expose()
  displayName: string;
}

export class UserGetListRO extends PaginateRO<UserGetListDataRO> {
  @ApiProperty({ type: [UserGetListDataRO] })
  @Type(() => UserGetListDataRO)
  @Expose()
  data: UserGetListDataRO[];
}

export class UserGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ example: 'tinpham' })
  @Expose()
  username: string;

  @ApiProperty({ required: false, example: 'tinpham@example.com' })
  @Expose()
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  @Expose()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @Expose()
  displayName: string;
}

export class UserUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ example: 'tinpham' })
  @Expose()
  username: string;

  @ApiProperty({ required: false, example: 'tinpham@example.com' })
  @Expose()
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  @Expose()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @Expose()
  displayName: string;

  @ApiProperty({ example: 1 })
  @Expose()
  imageId: number;

  constructor(data?: UserUpdateRO) {
    Object.assign(this, data);
  }
}

export class UserDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}

export class UserGetProfileRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ example: 'tinpham' })
  @Expose()
  username: string;

  @ApiProperty({ required: false, example: 'tinpham@example.com' })
  @Expose()
  email?: string;

  @ApiProperty({ required: false, example: '0987654321' })
  @Expose()
  phone?: string;

  @ApiProperty({ example: 'Tin Pham' })
  @Expose()
  displayName: string;

  @ApiProperty({ example: 1 })
  @Expose()
  imageId: number;

  @ApiProperty()
  @Expose()
  imageUrl: string;

  constructor(data?: UserGetProfileRO) {
    Object.assign(this, data);
  }
}
