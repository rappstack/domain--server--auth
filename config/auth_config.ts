import { type AuthConfig } from '@auth/core'
import { ns_id_be_memo_pair_ } from 'ctx-core/rmemo'
import { type wide_app_ctx_T } from 'relysjs/server'
export const [
	auth_config$_,
	auth_config_,
	auth_config__set,
] = ns_id_be_memo_pair_<AuthConfig|undefined, 'app', wide_app_ctx_T>(
	'app',
	'auth_config',
	()=>undefined)
