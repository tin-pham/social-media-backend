import { sql } from 'kysely';
import { DATABASE_TABLE } from '../common';
import { DatabaseService } from '../database';

const { NAME, SCHEMA } = DATABASE_TABLE.LESSON;
const { NAME: SECTION_NAME, SCHEMA: SECTION_SCHEMA } = DATABASE_TABLE.SECTION;
const { NAME: VIDEO_NAME, SCHEMA: VIDEO_SCHEMA } = DATABASE_TABLE.VIDEO;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'serial', (column) => column.primaryKey())
    .addColumn(SCHEMA.TITLE, 'varchar(255)', (column) => column.notNull())
    .addColumn(SCHEMA.BODY, 'json')
    .addColumn(SCHEMA.VIDEO_ID, 'integer', (column) => column.references(`${VIDEO_NAME}.${VIDEO_SCHEMA.ID}`))
    .addColumn(SCHEMA.SECTION_ID, 'integer', (column) => column.notNull().references(`${SECTION_NAME}.${SECTION_SCHEMA.ID}`))
    .addColumn(SCHEMA.CREATED_AT, 'timestamptz', (column) => column.defaultTo(sql`now()`))
    .addColumn(SCHEMA.CREATED_BY, 'integer', (column) => column.references(`${USER_NAME}.${USER_SCHEMA.ID}`))
    .addColumn(SCHEMA.UPDATED_AT, 'timestamptz')
    .addColumn(SCHEMA.UPDATED_BY, 'integer', (column) => column.references(`${USER_NAME}.${USER_SCHEMA.ID}`))
    .addColumn(SCHEMA.DELETED_AT, 'timestamptz')
    .addColumn(SCHEMA.DELETED_BY, 'integer', (column) => column.references(`${USER_NAME}.${USER_SCHEMA.ID}`))
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
