import { Auth } from '@auth/core'
import { type Session } from '@auth/core/types'
import { id_be_memo_pair_, request_, type request_ctx_T, request_url_ } from 'relysjs/server'
import { auth_config_ } from '../config/index.js'
export const [
	,
	session_
] = id_be_memo_pair_(
	'session',
	(ctx:request_ctx_T, session$)=>{
		session__get(ctx)
			.then(session=>{
				session$._ = session
			})
			.catch(err=>console.error(err))
		return session$.val
	}
)
/**
 * Roundabout way to get the session since @auth/core doesn't export it
 */
export async function session__get(request_ctx:request_ctx_T) {
	try {
		const url = `${request_url_(request_ctx).origin}/api/auth/session`
		console.debug('session__get|debug|1', {
			url,
			headers: request_(request_ctx).headers
		})
		const res = await fetch(url, {
			method: 'POST',
			headers: request_(request_ctx).headers
		})
		console.debug('session__get|debug|2', {
			json: await res.json()
		})
		const session = await Auth(
			new Request(url, {
				method: 'POST',
				headers: request_(request_ctx).headers,
			}),
			auth_config_(request_ctx)!)
		return await session.json() as Session
	} catch (err) {
		return null
	}
}
