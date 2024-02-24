import { DrizzleSQLiteAdapter } from '@persontric/adapter-drizzle'
import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { Persontric } from 'persontric'
import { id_be_memo_pair_, id_be_sig_triple_, type request_ctx_T } from 'relysjs/server'
import { person_tbl, session_tbl } from '../schema/index.js'
export const [
	,
	persontric_,
	persontric__set,
] = id_be_sig_triple_(
	'persontric',
	(ctx:request_ctx_T)=>
		new Persontric(
			auth_adapter_(ctx)))
export const [
	,
	auth_adapter_
] = id_be_memo_pair_(
	'auth_adapter',
	(ctx:request_ctx_T)=>new DrizzleSQLiteAdapter(
		drizzle_db_(ctx),
		session_tbl,
		person_tbl)
)
