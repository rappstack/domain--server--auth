import { ns_id_be_memo_pair_, ns_id_be_sig_triple_ } from 'ctx-core/rmemo'
import { TimeSpan } from 'oslo'
import { CookieController } from 'oslo/cookie'
export const [
	,
	session_cookie_name_,
	session_cookie_name__set,
] = ns_id_be_sig_triple_(
	'app',
	'session_cookie_name',
	()=>'auth_session')
export const [
	,
	session_cookie_attributes_,
	session_cookie_attributes__set,
] = ns_id_be_sig_triple_(
	'app',
	'session_cookie_attributes',
	()=><session_cookie_attributes_T>{
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
	})
export const [
	,
	session_expire_ttl_,
	session_expire_ttl__set
] = ns_id_be_sig_triple_(
	'app',
	'session_expire_ttl',
	()=>new TimeSpan(30, 'd'))
export const [
	,
	session_cookie_controller_,
] = ns_id_be_memo_pair_(
	'app',
	'session_cookie_controller',
	ctx=>new CookieController(
		session_cookie_name_(ctx),
		session_cookie_attributes_(ctx),
		{ expiresIn: session_expire_ttl_(ctx) }))
export interface session_cookie_attributes_T {
	secure?:boolean
	path?:string
	domain?:string
	sameSite?:'lax'|'strict'|'none'
	httpOnly?:boolean
	maxAge?:number
	expires?:Date
}
