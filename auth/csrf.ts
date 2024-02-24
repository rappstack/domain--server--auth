import { verifyRequestOrigin } from 'oslo/request'
import { id_be_memo_pair_, request_, type request_ctx_T } from 'relysjs/server'
export const [
	,
	csrf_403_response_
] = id_be_memo_pair_(
	'csrf_403_response',
	(ctx:request_ctx_T)=>{
		const request = request_(ctx)
		if (request.method === 'GET') return null
		const header_origin = request.headers.get('Origin')
		const header_host = request.headers.get('Host')
		console.debug('csrf_403_response|debug|1', {
			headers: request.headers,
			header_origin,
			header_host,
		})
		return (
			!header_origin || !header_host || !verifyRequestOrigin(header_origin, [header_host])
				? new Response(null, { status: 403 })
				: null
		)
	}
)
