import type { AdapterAccount } from '@auth/core/adapters'
import { integer, primaryKey, sqliteTable, text, } from 'drizzle-orm/sqlite-core'
export const user = sqliteTable('user', {
	user_id: text('user_id').notNull().primaryKey(),
	name: text('name'),
	email: text('email'),
	email_verified: integer('email_verified', { mode: 'timestamp_ms' }),
	image: text('image'),
})
export const account = sqliteTable('account', {
	user_id:
		text('user_id')
			.notNull()
			.references(()=>user.user_id, { onDelete: 'cascade' }),
	type: text('type').$type<AdapterAccount['type']>().notNull(),
	provider: text('provider').notNull(),
	provider_account_id: text('provider_account_id').notNull(),
	refresh_token: text('refresh_token'),
	access_token: text('access_token'),
	expires_at: integer('expires_at'),
	token_type: text('token_type'),
	scope: text('scope'),
	id_token: text('id_token'),
	session_state: text('session_state'),
}, table=>({
	pk: primaryKey({
		columns: [table.provider, table.provider_account_id]
	})
}))
export const session = sqliteTable('session', {
	session_token: text('session_token').notNull().primaryKey(),
	user_id:
		text('user_id')
			.notNull()
			.references(()=>user.user_id, { onDelete: 'cascade' }),
	expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
})
export const verification_token = sqliteTable('verification_token', {
	identifier: text('identifier').notNull(),
	token: text('token').notNull(),
	expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
}, table=>({
	pk: primaryKey({
		columns: [table.identifier, table.token]
	})
}))
