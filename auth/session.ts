import { Auth } from '@auth/core'
import { type Session } from '@auth/core/types'
import { request_, request_url_, type request_ctx_T } from 'relysjs/server'
import { auth_config_ } from '../config/index.js'
/**
 * Roundabout way to get the session since @auth/core doesn't export it
 */
export async function session_(request_ctx:request_ctx_T) {
	try {
		const url = `${request_url_(request_ctx).origin}/api/auth/session`
		const session = await Auth(
			new Request(url, {
				method: 'GET',
				headers: request_(request_ctx).headers,
			}),
			auth_config_(request_ctx)!)
		return await session.json() as Session
	} catch (err) {
		return null
	}
}
