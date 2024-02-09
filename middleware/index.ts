import { Auth } from '@auth/core'
import { Elysia } from 'elysia'
import { middleware_ } from 'relysjs/server'
import { auth_config_ } from '../config/index.js'
export const auth_middleware_ = middleware_(middleware_ctx=>
	new Elysia({ prefix: '/auth' })
		.get('/*', async context=>
			Auth(context.request, auth_config_(middleware_ctx)!))
		.post('/*', async context=>
			Auth(context.request, auth_config_(middleware_ctx)!)))
