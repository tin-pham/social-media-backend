import { BaseEntity } from '../base/base.entity';

export class AssignmentAttachmentEntity extends BaseEntity {
  attachmentId: number;

  assignmentId: number;

  constructor(data?: AssignmentAttachmentEntity) {
    super(data);
    Object.assign(this, data);
  }
}
