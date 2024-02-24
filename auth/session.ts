import { id_be_memo_pair_, request_, type request_ctx_T, run } from 'relysjs/server'
import { persontric_ } from './persontric.js'
export const [
	,
	session_id_
] = id_be_memo_pair_(
	'session_id',
	(ctx:request_ctx_T)=>{
		const Cookie = request_(ctx).headers.get('Cookie') ?? ''
		return persontric_(ctx).session_cookie__read(Cookie)
	}
)
export const [
	,
	no_session_401_response_
] = id_be_memo_pair_(
	'no_session_401_response',
	(ctx:request_ctx_T)=>
		session_id_(ctx)
			? null
			: new Response(null, { status: 401 })
)
export const [
	,
	session_headers_
] = id_be_memo_pair_<Headers|undefined, unknown, request_ctx_T>(
	'session_headers',
	(ctx, session_headers$)=>{
		const session_id = session_id_(ctx)
		if (!session_id) return new Headers()
		run(async ()=>{
			const headers = new Headers()
			let persontric = persontric_(ctx)
			const {
				person,
				session
			} = await persontric.session__validate(session_id)
			const session_cookie =
				!session
					? persontric.session__createBlankCookie()
					: session.fresh
						? persontric.session__createCookie(session_id)
						: null
			if (session_cookie) {
				headers.append('Set-Cookie', session_cookie.serialize())
			}
			session_headers$._ = headers
		}).catch(err=>{
			console.error(err)
			session_headers$._ = new Headers()
		})
	}
)
