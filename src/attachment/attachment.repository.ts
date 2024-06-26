import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { AttachmentEntity } from './attachment.entity';
import { AttachmentGetListDTO } from './dto/attachment.dto';

@Injectable()
export class AttachmentRepository {
  constructor(private readonly database: DatabaseService) {}

  deleteMultipleWithTransaction(transaction: Transaction, ids: number[], actorId: number) {
    return transaction
      .updateTable('attachment')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', 'in', ids)
      .returning(['url'])
      .execute();
  }

  deleteWithTransaction(transaction: Transaction, id: number, actorId: number) {
    return transaction.updateTable('attachment').set({ deletedAt: new Date(), deletedBy: actorId }).where('id', '=', id).execute();
  }

  insertMultipleWithTransaction(transaction: Transaction, entities: AttachmentEntity[]) {
    return transaction
      .insertInto('attachment')
      .values(entities)
      .returning(['id', 'url', 'name', 'type', 'size', 'createdAt', 'createdBy'])
      .execute();
  }

  insertWithTransaction(transaction: Transaction, entity: AttachmentEntity) {
    return transaction
      .insertInto('attachment')
      .values(entity)
      .returning(['id', 'url', 'name', 'type', 'size', 'createdAt', 'createdBy', 'lessonId'])
      .executeTakeFirst();
  }

  findOneByAssignmentIdAndCreatedById(assignmentId: number, createdById: number) {
    return this.database
      .selectFrom('attachment')
      .select(['id', 'url', 'name', 'type', 'size', 'createdAt', 'createdBy', 'lessonId'])
      .where('assignmentId', '=', assignmentId)
      .where('createdBy', '=', createdById)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  find(dto: AttachmentGetListDTO) {
    const { lessonId, page, limit, assignmentId, createdBy } = dto;

    const withLesson = Boolean(lessonId);
    const withAssignment = Boolean(assignmentId);
    const withCreatedBy = Boolean(createdBy);

    const query = this.database
      .selectFrom('attachment')
      .where('attachment.deletedAt', 'is', null)
      .innerJoin('users', 'users.id', 'attachment.createdBy')
      .where('users.deletedAt', 'is', null)
      .leftJoin('userImage', 'userImage.userId', 'users.id')
      .where('userImage.deletedAt', 'is', null)
      .leftJoin('image', 'image.id', 'userImage.imageId')
      .where('image.deletedAt', 'is', null)
      .orderBy('attachment.createdAt', 'desc')
      .select([
        'attachment.id',
        'attachment.url',
        'attachment.name',
        'attachment.size',
        'attachment.type',
        'attachment.createdAt',
        'attachment.createdBy',
        'users.displayName as createdByDisplayName',
        'image.url as createdByImageUrl',
      ])

      .$if(withLesson, (q) =>
        q.innerJoin('lesson', 'lesson.id', 'attachment.lessonId').where('lesson.deletedAt', 'is', null).where('lesson.id', '=', lessonId),
      )
      .$if(withAssignment, (q) =>
        q
          .innerJoin('assignment', 'assignment.id', 'attachment.assignmentId')
          .where('assignment.deletedAt', 'is', null)
          .where('assignment.id', '=', assignmentId),
      )
      .$if(withCreatedBy, (q) =>
        q.innerJoin('users', 'users.id', 'attachment.createdBy').where('users.deletedAt', 'is', null).where('users.id', '=', createdBy),
      );

    return paginate(query, { page, limit });
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('attachment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('attachment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByAssignmentIdAndCreatedById(assignmentId: number, createdBy: number) {
    const { count } = await this.database
      .selectFrom('attachment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('assignmentId', '=', assignmentId)
      .where('createdBy', '=', createdBy)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  insertMultiple(entities: AttachmentEntity[]) {
    return this.database.insertInto('attachment').values(entities).returning(['id']).execute();
  }

  deleteMultipleByIds(ids: number[], actorId: number) {
    return this.database.updateTable('attachment').set({ deletedAt: new Date(), deletedBy: actorId }).where('id', 'in', ids).execute();
  }
}
