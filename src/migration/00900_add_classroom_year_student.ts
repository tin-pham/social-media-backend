import { sql } from 'kysely';
import { DatabaseService } from '../database';
import { DATABASE_TABLE } from '../common';

const { NAME, SCHEMA } = DATABASE_TABLE.CLASSROOM_YEAR_STUDENT;
const { NAME: CLASSROOM_YEAR_NAME, SCHEMA: CLASSROOM_YEAR_SCHEMA } =
  DATABASE_TABLE.CLASSROOM_YEAR;
const { NAME: STUDENT_NAME, SCHEMA: STUDENT_SCHEMA } = DATABASE_TABLE.STUDENT;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'varchar(50)', (column) =>
      column.primaryKey().defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn(SCHEMA.CLASSROOM_YEAR_ID, 'varchar(50)', (column) =>
      column.references(`${CLASSROOM_YEAR_NAME}.${CLASSROOM_YEAR_SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.STUDENT_ID, 'varchar(50)', (column) =>
      column.references(`${STUDENT_NAME}.${STUDENT_SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.CREATED_AT, 'timestamptz', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.CREATED_BY, 'varchar(50)', (column) =>
      column.references(`${USER_NAME}.${USER_SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.UPDATED_AT, 'timestamptz')
    .addColumn(SCHEMA.UPDATED_BY, 'varchar(50)', (column) =>
      column.references(`${USER_NAME}.${USER_SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.DELETED_AT, 'timestamptz')
    .addColumn(SCHEMA.DELETED_BY, 'varchar(50)', (column) =>
      column.references(`${USER_NAME}.${USER_SCHEMA.ID}`),
    )
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
