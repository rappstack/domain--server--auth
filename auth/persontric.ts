import { DrizzleSQLiteAdapter } from '@persontric/adapter-drizzle'
import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { ns_id_be_sig_triple_ } from 'ctx-core/rmemo'
import { Persontric } from 'persontric'
import { person_tbl, session_tbl } from '../schema/index.js'
export const [
	,
	persontric_,
	persontric__set,
] = ns_id_be_sig_triple_(
	'app',
	'persontric',
	ctx=>new Persontric(
		auth_adapter_(ctx)))
export const [
	,
	auth_adapter_,
	auth_adapter__set,
] = ns_id_be_sig_triple_(
	'app',
	'auth_adapter',
	ctx=>new DrizzleSQLiteAdapter(
		drizzle_db_(ctx),
		session_tbl,
		person_tbl))
