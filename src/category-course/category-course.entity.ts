import { BaseEntity } from '../base/base.entity';

export class CategoryCourseEntity extends BaseEntity {
  categoryId: number;
  courseId: number;

  constructor(data?: CategoryCourseEntity) {
    super(data);
  }
}
