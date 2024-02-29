import { index, integer, sqliteTable, text, } from 'drizzle-orm/sqlite-core'
export const person_tbl_columns = Object.freeze({
	id: text('id').notNull().primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name'),
	email_verified: integer('email_verified', { mode: 'timestamp_ms' }),
	image: text('image'),
})
export const person_tbl = sqliteTable('person', person_tbl_columns)
export const google_person_tbl_columns = Object.freeze({
	google_sub: text('google_sub'),
	google_picture: text('google_picture'),
})
export const google_person_tbl = sqliteTable('person', {
	...person_tbl_columns,
	...google_person_tbl_columns
})
const session_tbl_columns = Object.freeze({
	id: text('id').notNull().primaryKey(),
	person_id: text('person_id').notNull().references(()=>person_tbl.id),
	expire_dts: integer('expire_dts', { mode: 'timestamp_ms' }).notNull(),
})
export const session_tbl = sqliteTable(
	'session',
	session_tbl_columns,
	session_tbl=>({
		person_id_idx: index('session_person_id_idx').on(session_tbl.person_id)
	}))
export const session_tbl_config = Object.freeze({
	person_id_idx: index('session_person_id_idx').on(session_tbl.person_id)
})
