import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import { I } from 'ctx-core/combinators'
import { ns_id_be_sig_triple_, type nullish } from 'ctx-core/rmemo'
import { eq } from 'drizzle-orm'
import { createDate, isWithinExpirationDate } from 'oslo'
import { rmemo__wait } from 'rebuildjs/server'
import { id_be_memo_pair_, nullish__none_, request_, type request_ctx_T, type wide_app_ctx_T } from 'relysjs/server'
import { session_tbl as _session_tbl } from '../schema/index.js'
import type { db_person_T, db_session_T, person_T, session_T, session_tbl_T } from './_types.js'
import { session_cookie_controller_, session_expire_ttl_ } from './cookie.js'
import { id__generate } from './crypto.js'
import { db_person__person__new, person_tbl_ } from './person.js'
export const [
	,
	session_tbl_,
	session_tbl__set,
] = ns_id_be_sig_triple_(
	'app',
	'session_tbl',
	()=><session_tbl_T>_session_tbl)
export const [
	,
	db_session__session__new_,
	db_session__session__new__set,
] = ns_id_be_sig_triple_<
	(db_session:db_session_T)=>session_T,
	'app'
>('app',
	'db_session__session__new',
	()=>db_session=>({
		...db_session,
		fresh: true,
	}))
export function db_session__session__new(
	ctx:wide_app_ctx_T,
	db_session:db_session_T
):session_T {
	return db_session__session__new_(ctx)(db_session)
}
export const [
	,
	session_id_
] = id_be_memo_pair_(
	'session_id',
	(ctx:request_ctx_T)=>{
		const Cookie = request_(ctx).headers.get('Cookie') ?? ''
		return session_cookie_controller_(ctx).parse(Cookie)
	})
export async function person_session_all_(ctx:request_ctx_T, person_id:string) {
	const session_tbl = session_tbl_(ctx)
	const db_session_a1 =
		drizzle_db_(ctx)
			.select()
			.from(session_tbl)
			.where(eq(session_tbl.person_id, person_id))
			.all()
	const session_a1:session_T[] = []
	for (const db_session of db_session_a1) {
		if (!isWithinExpirationDate(db_session.expire_dts)) {
			continue
		}
		session_a1.push({
			...db_session__session__new(ctx, db_session),
			fresh: false,
		})
	}
	return session_a1
}
export const [
	,
	session_person_o_
] = id_be_memo_pair_<
	{ person:person_T; session:session_T }|{ person:null; session:null }|undefined,
	unknown,
	request_ctx_T
>('session_person_o',
	(ctx, $)=>{
		return nullish__none_([session_id_(ctx)], (
			session_id
		)=>{
			/** @see {import('persontric').session__validate} */
			const session_tbl = session_tbl_(ctx)
			const [db_session, db_person] = session_person_pair_()
			if (!db_session) {
				return { session: null, person: null }
			} else if (!db_person || !isWithinExpirationDate(db_session.expire_dts)) {
				drizzle_db_(ctx).delete(session_tbl).where(eq(session_tbl.id, session_id))
				return { session: null, person: null }
			}
			const active_period_expiration_date = new Date(
				db_session.expire_dts.getTime() - session_expire_ttl_(ctx).milliseconds() / 2)
			const session = <session_T>{
				...db_session__session__new(ctx, db_session),
				fresh: false,
			}
			if (!isWithinExpirationDate(active_period_expiration_date)) {
				session.fresh = true
				session.expire_dts = createDate(session_expire_ttl_(ctx))
				drizzle_db_(ctx)
					.update(session_tbl)
					.set({ expire_dts: session.expire_dts })
					.where(eq(session_tbl.id, session_id))
					.run()
			}
			const person = <person_T>{
				...db_person__person__new(ctx, db_person),
				id: db_person.id
			}
			return { session, person }
			/** @see {import('@persontric/adapter-drizzle').DrizzleSQLiteAdapter.session_person_pair_} */
			function session_person_pair_():[
					db_session_T|undefined,
					db_person_T|undefined
			] {
				const db_session = drizzle_db_(ctx)
					.select()
					.from(session_tbl)
					.where(eq(session_tbl.id, session_id))
					.limit(1).all()[0]
				const person_tbl = person_tbl_(ctx)
				const db_person = db_session
					? drizzle_db_(ctx).select().from(person_tbl).where(eq(person_tbl.id, db_session.person_id)).limit(1).all()[0]
					: undefined
				return [db_session, db_person]
			}
		})
	})
export const [
	,
	session_,
] = id_be_memo_pair_(
	'session',
	(ctx:request_ctx_T)=>
		nullish__none_([session_person_o_(ctx)],
			session_person_o=>session_person_o.session as session_T))
export const [
	,
	person_,
] = id_be_memo_pair_<person_T|nullish, unknown, request_ctx_T>(
	'person',
	ctx=>
		nullish__none_([session_person_o_(ctx)],
			session_person_o=>session_person_o.person))
export function person__wait(ctx:request_ctx_T, timeout?:number) {
	return rmemo__wait(()=>person_(ctx), person=>person !== undefined, timeout ?? 5_000)
}
export const [
	,
	no_session_401_response_
] = id_be_memo_pair_(
	'no_session_401_response',
	(ctx:request_ctx_T)=>
		session_id_(ctx)
			? null
			: new Response(null, { status: 401 }))
export const [
	,
	session_headers_
] = id_be_memo_pair_<Headers|undefined, unknown, request_ctx_T>(
	'session_headers',
	ctx=>{
		const session_id = session_id_(ctx)
		if (!session_id) return new Headers()
		const headers = new Headers()
		const session = session_(ctx)
		const session_cookie =
			!session
				? session__createBlankCookie(ctx)
				: session.fresh
					? session__createCookie(ctx, session_id)
					: null
		if (session_cookie) {
			headers.append('Set-Cookie', session_cookie.serialize())
		}
		return headers
	})
export function session_headers__wait(ctx:request_ctx_T, timeout?:number) {
	return rmemo__wait(()=>session_headers_(ctx), I, timeout ?? 5_000)
}
/** @see {import('persontric').Persontric.session__create} */
export function session__create(
	ctx:request_ctx_T,
	db_session:Partial<db_session_T>&{ person_id:string }
) {
	db_session.id ??= id__generate(40)
	db_session.expire_dts ??= createDate(session_expire_ttl_(ctx))
	session__set()
	return <session_T>{
		...db_session__session__new(ctx, <db_session_T>db_session),
		fresh: true,
	}
	/** @see {import('@persontric/adapter-drizzle').DrizzleSQLiteAdapter.session__set} */
	function session__set() {
		drizzle_db_(ctx)
			.insert(session_tbl_(ctx))
			.values(<db_session_T>db_session)
			.run()
	}
}
export function session__createBlankCookie(ctx:wide_app_ctx_T) {
	return session_cookie_controller_(ctx).createBlankCookie()
}
export function session__createCookie(ctx:wide_app_ctx_T, session_id:string) {
	return session_cookie_controller_(ctx).createCookie(session_id)
}
