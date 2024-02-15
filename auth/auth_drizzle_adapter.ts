import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { and, eq } from 'drizzle-orm'
import { type wide_app_ctx_T } from 'relysjs/server'
import { account_tbl, user_tbl } from '../schema/index.js'
export function auth_drizzle_adapter_(app_ctx:wide_app_ctx_T) {
	return {
		...DrizzleAdapter(drizzle_db_(app_ctx)),
		async getUserByAccount(provider_account:{
			provider:string
			providerAccountId:string
		}) {
			const results =
				drizzle_db_(app_ctx)
					.select()
					.from(account_tbl)
					.leftJoin(user_tbl, eq(user_tbl.user_id, account_tbl.user_id))
					.where(
						and(
							eq(account_tbl.provider, provider_account.provider),
							eq(account_tbl.provider_account_id, provider_account.providerAccountId)))
					.get()
			return results?.user ?? null
		},
	}
}
