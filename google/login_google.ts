import { drizzle_db_ } from '@rappstack/domain--server/drizzle'
import '@rappstack/domain--server--auth/auth'
import { redirect_response__new } from '@rappstack/domain--server/response'
import { generateCodeVerifier, generateState, Google, OAuth2RequestError } from 'arctic'
import { eq, or } from 'drizzle-orm'
import { parseCookies, serializeCookie } from 'oslo/cookie'
import { request_, type request_ctx_T, request_url_ } from 'relysjs/server'
import { id__generate, person_tbl_, session__create, session__createCookie } from '../auth/index.js'
import { google_person_tbl } from '../schema/index.js'
import { auth_google_id_, auth_google_secret_ } from './auth_google.js'
export async function login_google__GET(request_ctx:request_ctx_T) {
	const { hostname, port } = request_url_(request_ctx)
	const scheme = hostname === 'localhost' ? 'http://' : 'https://'
	const origin = hostname + (port ? ':' + port : '')
	const google = new Google(
		auth_google_id_(request_ctx),
		auth_google_secret_(request_ctx),
		scheme + origin + '/login/google/callback')
	const state = generateState()
	const code_verifier = generateCodeVerifier()
	const url = await google.createAuthorizationURL(state, code_verifier, {
		scopes: ['email', 'profile']
	})
	url.searchParams.set('access_type', 'offline')
	const secure = scheme === 'https://'
	const headers = new Headers()
	headers.append(
		'set-cookie',
		serializeCookie('state', state, {
			secure,
			path: '/',
			httpOnly: true,
			maxAge: 60 * 10 // 10 min
		}))
	headers.append(
		'set-cookie',
		serializeCookie('code_verifier', code_verifier, {
			secure,
			path: '/',
			httpOnly: true,
			maxAge: 60 * 10 // 10 min
		}))
	return redirect_response__new(302, url.href, { headers })
}
export async function login_google_callback__GET(request_ctx:request_ctx_T) {
	const request = request_(request_ctx)
	const request_url = request_url_(request_ctx)
	const { hostname, port } = request_url
	const scheme = hostname === 'localhost' ? 'http://' : 'https://'
	const origin = hostname + (port ? ':' + port : '')
	const google = new Google(
		auth_google_id_(request_ctx),
		auth_google_secret_(request_ctx),
		scheme + origin + '/login/google/callback')
	const code = request_url.searchParams.get('code')
	const state = request_url.searchParams.get('state')
	const cookie = parseCookies(request.headers.get('cookie') ?? '')
	const stored_state = cookie.get('state')
	const stored_code_verifier = cookie.get('code_verifier')
	if (!code || !stored_state || !stored_code_verifier || state !== stored_state) {
		// 400
		throw Error('Invalid request')
	}
	try {
		const tokens = await google.validateAuthorizationCode(code, stored_code_verifier)
		const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		})
		const userinfo:google_userinfo_T = await response.json()
		const db = drizzle_db_(request_ctx)!
		const person_tbl = <typeof google_person_tbl>person_tbl_(request_ctx)
		let person = db
			.select()
			.from(person_tbl)
			.where(
				or(
					eq(person_tbl.google_sub, userinfo.sub!),
					eq(person_tbl.email, userinfo.email!)))
			.limit(1)
			.all()[0]
		if (person) {
			if (
				person.google_sub !== userinfo.sub
				|| person.google_picture !== userinfo.picture
			) {
				person.google_sub = userinfo.sub
				person.google_picture = userinfo.picture ?? null
				db.update(person_tbl)
					.set(person)
					.where(eq(person_tbl.id, person.id))
					.run()
			}
		} else if (!person) {
			const person_id = id__generate(15)
			person = db
				.insert(person_tbl)
				.values({
					id: person_id,
					name: userinfo.name,
					email: userinfo.email!,
					image: userinfo.picture,
					google_sub: userinfo.sub,
					google_picture: userinfo.picture
				})
				.returning()
				.all()[0]
		}
		const session = session__create(request_ctx, { person_id: person.id })
		const session_cookie = session__createCookie(request_ctx, session.id)
		return redirect_response__new(302, '/', {
			headers: {
				'Set-Cookie': session_cookie.serialize()
			}
		})
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			const { message, description } = e
			return redirect_response__new(302, '/?error=' + (description ?? message ?? 'OAuth Error'))
		}
		throw e
	}
}
export type google_userinfo_T = {
	sub:string
	name?:string
	given_name?:string
	family_name?:string
	picture?:string
	email?:string
	email_verified?:boolean
	locale?:string
}
