import { BaseEntity } from '../base/base.entity';

export class MenuEntity extends BaseEntity {
  name: string;

  icon: string;

  route: string;

  constructor(data?: Partial<MenuEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
