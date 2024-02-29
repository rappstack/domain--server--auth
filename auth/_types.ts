import { InferSelectModel } from 'drizzle-orm'
import { person_tbl, session_tbl } from '../schema/index.js'
export interface register_T {
}
export type session_tbl_T = register_T extends {
	session_tbl: infer _session_tbl
} ? _session_tbl : typeof session_tbl
export type db_session_T = register_T extends {
	db_session:infer _db_session
} ? _db_session : InferSelectModel<session_tbl_T>
export type session_T = register_T extends {
	session:infer _session extends base_session_T
} ? _session : base_session_T
export interface base_session_T extends db_session_T {
	fresh:boolean
}
export type person_tbl_T = register_T extends {
	person_tbl: infer _person_tbl
} ? _person_tbl : typeof person_tbl
export type db_person_T = register_T extends {
	db_person:infer _db_person
} ? _db_person : InferSelectModel<person_tbl_T>
export type person_T = register_T extends {
	person:infer _person extends base_person_T
} ? _person : base_person_T
export interface base_person_T extends db_person_T {
}
