import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { CourseEntity } from './course.entity';
import { CourseGetDetailDTO, CourseGetListDTO } from './dto/course.dto';

@Injectable()
export class CourseRepository {
  constructor(private readonly database: DatabaseService) {}

  insertWithTransaction(transaction: Transaction, entity: CourseEntity) {
    return transaction.insertInto('course').values(entity).returning(['id', 'name', 'description', 'levelId', 'hours']).executeTakeFirst();
  }

  findByStudentId(studentId: string, dto: CourseGetListDTO) {
    const { limit, page, withAssignmentCount } = dto;

    const query = this.database
      .selectFrom('course')
      .distinct()
      .where('course.deletedAt', 'is', null)
      .innerJoin('level', 'level.id', 'course.levelId')
      .where('level.deletedAt', 'is', null)
      .leftJoin('courseStudent', 'courseStudent.courseId', 'course.id')
      .where('courseStudent.deletedAt', 'is', null)
      .where('courseStudent.studentId', '=', studentId)
      .leftJoin('courseImage', (join) => join.onRef('courseImage.courseId', '=', 'course.id').on('courseImage.deletedAt', 'is', null))
      .leftJoin('image', (join) => join.onRef('image.id', '=', 'courseImage.imageId').on('image.deletedAt', 'is', null))
      .$if(withAssignmentCount, (qb) =>
        qb
          .leftJoin('courseAssignment', (join) =>
            join.onRef('courseAssignment.courseId', '=', 'course.id').on('courseAssignment.deletedAt', 'is', null),
          )
          .leftJoin('assignment', (join) =>
            join.onRef('assignment.id', '=', 'courseAssignment.assignmentId').on('assignment.deletedAt', 'is', null),
          )
          .leftJoin('assignmentSubmit', (join) =>
            join.onRef('assignmentSubmit.assignmentId', '=', 'assignment.id').on('assignmentSubmit.deletedAt', 'is', null),
          )
          .groupBy(['course.id', 'course.name', 'course.description', 'image.id', 'image.url', 'level.name', 'course.hours', 'level.id'])
          .select(({ fn }) => fn.count('assignment.id').filterWhere('assignmentSubmit.id', 'is', null).as('unsubmittedPendingCount'))
          .orderBy('unsubmittedPendingCount', 'desc'),
      )
      .select([
        'course.id',
        'course.name',
        'course.description',
        'image.url as imageUrl',
        'level.name as levelName',
        'level.id as levelId',
        'course.hours',
      ]);

    return paginate(query, { limit, page });
  }

  find(dto: CourseGetListDTO) {
    const { limit, page, categoryId, withAssignmentCount } = dto;

    const byCategory = Boolean(categoryId);

    const query = this.database
      .selectFrom('course')
      .where('course.deletedAt', 'is', null)
      .innerJoin('level', 'level.id', 'course.levelId')
      .where('level.deletedAt', 'is', null)
      .leftJoin('courseImage', (join) => join.onRef('courseImage.courseId', '=', 'course.id').on('courseImage.deletedAt', 'is', null))
      .leftJoin('image', (join) => join.onRef('image.id', '=', 'courseImage.imageId').on('image.deletedAt', 'is', null))
      .orderBy('course.createdAt', 'desc')
      .$if(byCategory, (qb) =>
        qb
          .innerJoin('categoryCourse', 'categoryCourse.courseId', 'course.id')
          .where('categoryCourse.deletedAt', 'is', null)
          .innerJoin('category', 'categoryCourse.categoryId', 'category.id')
          .where('category.deletedAt', 'is', null)
          .where('category.id', '=', categoryId),
      )
      .$if(categoryId === null, (qb) =>
        qb
          .leftJoin('categoryCourse', (join) =>
            join.onRef('course.id', '=', 'categoryCourse.courseId').on('categoryCourse.deletedAt', 'is', null),
          )
          .where('categoryCourse.courseId', 'is', null),
      )
      .$if(withAssignmentCount, (qb) =>
        qb
          .leftJoin('courseAssignment', (join) =>
            join.onRef('courseAssignment.courseId', '=', 'course.id').on('courseAssignment.deletedAt', 'is', null),
          )
          .leftJoin('assignment', (join) =>
            join.onRef('assignment.id', '=', 'courseAssignment.assignmentId').on('assignment.deletedAt', 'is', null),
          )
          .groupBy('course.id')
          .select(({ fn }) => fn.countAll().as('assignmentCount')),
      )
      .select([
        'course.id',
        'course.name',
        'course.description',
        'image.url as imageUrl',
        'level.id as levelId',
        'level.name as levelName',
        'course.hours',
      ]);
    return paginate(query, { limit, page });
  }

  findOneById(id: number, dto?: CourseGetDetailDTO) {
    const { withCategoryIds } = dto;
    return this.database
      .selectFrom('course')
      .where('course.id', '=', id)
      .where('course.deletedAt', 'is', null)
      .innerJoin('level', 'level.id', 'course.levelId')
      .where('level.deletedAt', 'is', null)
      .leftJoin('courseImage', (join) => join.onRef('courseImage.courseId', '=', 'course.id').on('courseImage.deletedAt', 'is', null))
      .leftJoin('image', (join) => join.onRef('image.id', '=', 'courseImage.imageId').on('image.deletedAt', 'is', null))
      .leftJoin('section', (join) => join.onRef('section.courseId', '=', 'course.id').on('section.deletedAt', 'is', null))
      .leftJoin('lesson', (join) => join.onRef('lesson.sectionId', '=', 'section.id').on('lesson.deletedAt', 'is', null))
      .groupBy(['course.id', 'course.name', 'course.description', 'image.id', 'image.url', 'level.name', 'course.hours'])
      .$if(withCategoryIds, (query) =>
        query
          .leftJoin('categoryCourse', (join) =>
            join.onRef('categoryCourse.courseId', '=', 'course.id').on('categoryCourse.deletedAt', 'is', null),
          )
          .select(({ fn, ref }) => [
            fn
              .coalesce(fn.jsonAgg(ref('categoryCourse.categoryId')).filterWhere('categoryCourse.categoryId', 'is not', null), sql`'[]'`)
              .as('categoryIds'),
          ]),
      )
      .select(({ fn }) => [
        'course.id',
        'course.name',
        'course.description',
        'image.url as imageUrl',
        'level.name as levelName',
        'level.id as levelId',
        'course.hours',
        fn.count('lesson.id').as('lessonCount'),
      ])
      .groupBy(['course.id', 'course.name', 'course.description', 'image.id', 'image.url', 'level.name', 'level.id', 'course.hours'])
      .executeTakeFirst();
  }

  updateWithTransaction(transaction: Transaction, id: number, entity: CourseEntity) {
    return transaction
      .updateTable('course')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name', 'description', 'levelId', 'hours'])
      .executeTakeFirst();
  }

  deleteWithTransaction(transaction: Transaction, id: number, actorId: number) {
    return transaction
      .updateTable('course')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countByName(name: string) {
    const { count } = await this.database
      .selectFrom('course')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('course.name', '=', name)
      .where('course.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByNameExceptId(name: string, id: number) {
    const { count } = await this.database
      .selectFrom('course')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('course.name', '=', name)
      .where('course.deletedAt', 'is', null)
      .where('course.id', '!=', id)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('course')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('course.id', '=', id)
      .where('course.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('course')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('course.id', 'in', ids)
      .where('course.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
