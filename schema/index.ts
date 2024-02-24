import { integer, sqliteTable, text, } from 'drizzle-orm/sqlite-core'
export const person_tbl_columns = Object.freeze({
	id: text('id').notNull().primaryKey(),
	name: text('name'),
	email_verified: integer('email_verified', { mode: 'timestamp_ms' }),
	image: text('image'),
})
export const person_tbl = sqliteTable('person', person_tbl_columns)
const session_tbl_columns = Object.freeze({
	id: text('id').notNull().primaryKey(),
	person_id: text('person_id').notNull().references(()=>person_tbl.id),
	expire_dts: integer('expire_dts', { mode: 'timestamp_ms' }).notNull(),
})
export const session_tbl = sqliteTable('session', session_tbl_columns)
