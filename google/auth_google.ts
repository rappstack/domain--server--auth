import { import_meta_env_ } from 'ctx-core/env'
import { ns_id_be_sig_triple_ } from 'ctx-core/rmemo'
export const [
	,
	auth_google_id_,
	auth_google_id__set,
] = ns_id_be_sig_triple_(
	'app',
	'auth_google_id',
	()=>import_meta_env_().AUTH_GOOGLE_ID)
export const [
	,
	auth_google_secret_,
	auth_google_secret__set,
] = ns_id_be_sig_triple_(
	'app',
	'auth_google_secret',
	()=>import_meta_env_().AUTH_GOOGLE_SECRET)
