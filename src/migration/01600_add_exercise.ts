import { sql } from 'kysely';
import { DATABASE_TABLE } from '../common';
import { DatabaseService } from '../database';

const { NAME, SCHEMA } = DATABASE_TABLE.EXERCISE;
const { NAME: DIFFICULTY_NAME, SCHEMA: DIFFICULTY_SCHEMA } = DATABASE_TABLE.DIFFICULTY;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'serial', (column) => column.primaryKey())
    .addColumn(SCHEMA.NAME, 'varchar(255)', (column) => column.notNull())
    .addColumn(SCHEMA.DIFFICULTY_ID, 'integer', (column) => column.notNull().references(`${DIFFICULTY_NAME}.${DIFFICULTY_SCHEMA.ID}`))
    .addColumn(SCHEMA.IS_ACTIVE, 'boolean', (column) => column.defaultTo(false))
    .addColumn(SCHEMA.INSTANT_MARK, 'boolean')
    .addColumn(SCHEMA.DUE_DATE, 'timestamptz')
    .addColumn(SCHEMA.ALLOW_REDO, 'boolean')
    .addColumn(SCHEMA.TIME, 'integer')
    .addColumn(SCHEMA.ACTIVATED_AT, 'timestamptz')
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
