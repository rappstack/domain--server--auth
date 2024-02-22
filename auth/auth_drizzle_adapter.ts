import { DrizzleSQLiteAdapter } from '@persontric/adapter-drizzle'
import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { type wide_app_ctx_T } from 'relysjs/server'
import { person_tbl, session_tbl } from '../schema/index.js'
export function auth_drizzle_adapter_(app_ctx:wide_app_ctx_T) {
	return new DrizzleSQLiteAdapter(
		drizzle_db_(app_ctx),
		session_tbl,
		person_tbl
	)
}
