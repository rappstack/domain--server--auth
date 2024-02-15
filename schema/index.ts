import type { AdapterAccount } from '@auth/core/adapters'
import { integer, primaryKey, sqliteTable, text, } from 'drizzle-orm/sqlite-core'
export const user_tbl = sqliteTable('user', {
	user_id: text('user_id').notNull().primaryKey(),
	name: text('name'),
	email: text('email'),
	email_verify_dts: integer('email_verify_dts', { mode: 'timestamp_ms' }),
	image: text('image'),
})
export const account_tbl = sqliteTable('account', {
	user_id:
		text('user_id')
			.notNull()
			.references(()=>user_tbl.user_id, { onDelete: 'cascade' }),
	type: text('type').$type<AdapterAccount['type']>().notNull(),
	provider: text('provider').notNull(),
	provider_account_id: text('provider_account_id').notNull(),
	refresh_token: text('refresh_token'),
	access_token: text('access_token'),
	expire_dts: integer('expire_dts', { mode: 'timestamp_ms' }),
	token_type: text('token_type'),
	scope: text('scope'),
	id_token: text('id_token'),
	session_state: text('session_state'),
}, table=>({
	pk: primaryKey({
		columns: [table.provider, table.provider_account_id]
	})
}))
export const session_tbl = sqliteTable('session', {
	session_token: text('session_token').notNull().primaryKey(),
	user_id:
		text('user_id')
			.notNull()
			.references(()=>user_tbl.user_id, { onDelete: 'cascade' }),
	expire_dts: integer('expire_dts', { mode: 'timestamp_ms' }).notNull(),
})
export const verification_token_tbl = sqliteTable('verification_token', {
	identifier: text('identifier').notNull(),
	token: text('token').notNull(),
	expire_dts: integer('expire_dts', { mode: 'timestamp_ms' }).notNull(),
}, table=>({
	pk: primaryKey({
		columns: [table.identifier, table.token]
	})
}))
