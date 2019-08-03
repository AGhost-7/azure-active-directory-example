import Koa from 'koa'
import crypto from 'crypto'

export default (ctx: Koa.Context, next: Function) => {
	if (ctx.method === 'GET' || ctx.path === '/authenticate/openid/return') {
		return next()
	}

	if (!ctx.session) {
		throw new Error('Session is uninitialized')
	}

	if (!ctx.session.csrf) {
		ctx.session.csrf = crypto.randomBytes(16).toString('hex')
	}

	const token = ctx.get('csrf-token') || ctx.body && ctx.body._csrf

	if (!token) {
		ctx.body = 'Missing csrf token'
		ctx.status = 401
		return
	}

	if (token !== ctx.session.csrf) {
		ctx.body = 'CSRF error'
		ctx.status = 401
		return
	}

	return next()
}
