import type { AdapterAccount } from '@auth/core/adapters'
import { integer, primaryKey, sqliteTable, text, } from 'drizzle-orm/sqlite-core'
export const user_tbl = sqliteTable('user', {
	userId: text('userId').notNull().primaryKey(),
	name: text('name'),
	email: text('email'),
	emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
	image: text('image'),
})
export const account_tbl = sqliteTable('account', {
	userId:
		text('userId')
			.notNull()
			.references(()=>user_tbl.userId, { onDelete: 'cascade' }),
	type: text('type').$type<AdapterAccount['type']>().notNull(),
	provider: text('provider').notNull(),
	providerAccountId: text('providerAccountId').notNull(),
	refresh_token: text('refresh_token'),
	access_token: text('access_token'),
	expires_at: integer('expires_at'),
	token_type: text('token_type'),
	scope: text('scope'),
	id_token: text('id_token'),
	session_state: text('session_state'),
}, account=>({
	compoundKey: primaryKey({
		columns: [account.provider, account.providerAccountId],
	}),
}))
export const session_tbl = sqliteTable('session', {
	sessionToken: text('sessionToken').notNull().primaryKey(),
	userId:
		text('userId')
			.notNull()
			.references(()=>user_tbl.userId, { onDelete: 'cascade' }),
	expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
})
export const verificationToken_tbl = sqliteTable('verificationToken', {
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
	},
	vt=>({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
	}))
