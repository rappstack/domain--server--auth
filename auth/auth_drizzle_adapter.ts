import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { and, eq } from 'drizzle-orm'
import { type wide_app_ctx_T } from 'relysjs/server'
import { account, user } from '../schema/index.js'
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
					.from(account)
					.leftJoin(user, eq(user.user_id, account.user_id))
					.where(
						and(
							eq(account.provider, provider_account.provider),
							eq(account.provider_account_id, provider_account.providerAccountId)))
					.get()
			return results?.user ?? null
		},
	}
}
