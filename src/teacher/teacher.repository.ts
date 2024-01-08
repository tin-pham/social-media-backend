import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { ROLE } from '../role/enum/role.enum';
import { TeacherEntity } from './teacher.entity';
import { TeacherGetListDTO } from './dto/teacher.dto';

@Injectable()
export class TeacherRepository {
  constructor(private readonly database: DatabaseService) {}

  insertWithTransaction(transaction: Transaction, entity: TeacherEntity) {
    return transaction.insertInto('teacher').values(entity).returning('id').executeTakeFirstOrThrow();
  }

  find(dto: TeacherGetListDTO) {
    const { limit, page, subjectId } = dto;
    const withSubject = Boolean(subjectId);

    const query = this.database
      .selectFrom('teacher')
      .innerJoin('users', 'users.id', 'teacher.userId')
      .innerJoin('userRole', 'users.id', 'userRole.userId')
      .innerJoin('role', 'userRole.roleId', 'role.id')
      .select(['users.username', 'users.email', 'users.phone', 'users.displayName', 'teacher.id'])
      .where('role.name', '=', ROLE.TEACHER)
      .where('users.deletedAt', 'is', null)
      .$if(withSubject, (query) =>
        query
          .innerJoin('teacherSubject', 'teacherSubject.teacherId', 'teacher.id')
          .where('teacherSubject.subjectId', '=', subjectId)
          .where('teacherSubject.deletedAt', 'is', null)
          .innerJoin('subject', 'subject.id', 'teacherSubject.subjectId')
          .where('subject.deletedAt', 'is', null)
          .select(({ fn, ref }) => [
            fn
              .coalesce(
                fn.jsonAgg(
                  jsonBuildObject({
                    id: ref('teacherSubject.id'),
                  }),
                ),
                sql`'[]'`,
              )
              .as('teacherSubjects'),
          ])
          .groupBy(['users.username', 'users.email', 'users.phone', 'users.displayName', 'teacher.id', 'teacherSubject.id']),
      );

    return paginate(query, {
      limit,
      page,
    });
  }

  findUserById(id: string) {
    return this.database
      .selectFrom('teacher')
      .innerJoin('users', 'users.id', 'teacher.userId')
      .selectAll('users')
      .where('teacher.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  findOneById(id: string) {
    return this.database
      .selectFrom('teacher')
      .innerJoin('users', 'users.id', 'teacher.userId')
      .selectAll('teacher')
      .where('teacher.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  async countById(id: string) {
    const { count } = await this.database
      .selectFrom('teacher')
      .innerJoin('users', 'users.id', 'teacher.userId')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('teacher.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: string[]) {
    const { count } = await this.database
      .selectFrom('teacher')
      .innerJoin('users', 'users.id', 'teacher.userId')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('teacher.id', 'in', ids)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  getIdByUserId(userId: number) {
    return this.database.selectFrom('teacher').select('teacher.id').where('teacher.userId', '=', userId).executeTakeFirst();
  }

  getUserIdByTeacherId(id: string) {
    return this.database.selectFrom('teacher').select('teacher.userId').where('teacher.id', '=', id).executeTakeFirst();
  }
}
