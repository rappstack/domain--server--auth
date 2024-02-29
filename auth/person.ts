import { ns_id_be_sig_triple_ } from 'ctx-core/rmemo'
import type { wide_app_ctx_T } from 'relysjs/server'
import { person_tbl as _person_tbl } from '../schema/index.js'
import type { db_person_T, person_T, person_tbl_T } from './_types.js'
export const [
	,
	person_tbl_,
	person_tbl__set,
] = ns_id_be_sig_triple_(
	'app',
	'person_tbl',
	()=><person_tbl_T>_person_tbl)
export const [
	,
	db_person__person__new_,
	db_person__person__new__set,
] = ns_id_be_sig_triple_<
	(db_person:db_person_T)=>person_T,
	'app'
>('app',
	'db_person__person__new',
	()=>db_person=>db_person)
export function db_person__person__new(
	ctx:wide_app_ctx_T,
	db_person:db_person_T
):person_T {
	return db_person__person__new_(ctx)(db_person)
}
