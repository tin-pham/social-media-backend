import { sql } from 'kysely';
import { DATABASE_TABLE } from '../common';
import { DatabaseService } from '../database';

const { NAME, SCHEMA } = DATABASE_TABLE.ROLE;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'serial', (column) => column.primaryKey())
    .addColumn(SCHEMA.NAME, 'varchar(50)', (column) => column.notNull())
    .addColumn(SCHEMA.CREATED_AT, 'timestamptz', (column) => column.defaultTo(sql`now()`))
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
