import config from './config'
import { URLSearchParams } from 'url'
import passport from './passport'
import route from 'koa-route'
import Koa from 'koa'
import User from './entities/user'
import fetch from 'node-fetch'

async function index(ctx: Koa.Context, next: Function) {
	await ctx.render('index', { user: ctx.state.user })
}

async function logout(ctx: Koa.Context) {
	await ctx.logout()
	await ctx.redirect('/')
}

async function redirectHome(ctx: Koa.Context) {
	return ctx.redirect('/')
}

interface GraphGroups {
	'@odata.context': string
	value: GraphGroup[]
}

interface GraphGroup {
	id: string
	deletedDateTime: string
	createdDateTime: string
	creationOptions: string[]
	description: string
	displayName: string
	groupTypes: string[]
	mail: string
	mailEnabled: boolean
	mailNickname: string
}

async function requireTeamA(ctx: Koa.Context, next: Function) {
	if (!ctx.isAuthenticated()) {
		ctx.status = 401
		return
	}
	const user = ctx.state.user
	const response = await fetch(
		`https://graph.microsoft.com/v1.0/users/${user.activeDirectoryApiId}/memberOf`,
		{
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + user.activeDirectoryToken
			}
		}
	)

	const body: GraphGroups = await response.json()
	const isTeamA = body.value.some(group => group.displayName === 'Team A')
	if (!isTeamA) {
		ctx.status = 401
		ctx.body = 'Not in team A'
		return
	}

	return next()
}

async function protectedEndpoint(ctx: Koa.Context) {
	ctx.body = { message: 'hello!' }
	ctx.status = 200
}

async function getCsrf(ctx: Koa.Context) {
	if (!ctx.session) {
		ctx.status = 500
		return
	}
	ctx.body = ctx.session.csrf
	ctx.status = 200
}

export default (app: Koa) => {
  app.use(
    route.get(
      '/authenticate/openid/return',
      passport.authenticate('azuread-openidconnect', {
        failureRedirect: '/'
      })
    )
  )
	app.use(route.get('/authenticate/openid/return', redirectHome))
  app.use(
    route.post(
      '/authenticate/openid/return',
      passport.authenticate('azuread-openidconnect', {
        failureRedirect: '/'
      })
    )
	)
	app.use(route.post('/authenticate/openid/return', redirectHome))
  app.use(
    route.get(
      '/authenticate/openid/login',
      passport.authenticate('azuread-openidconnect', {
        failureRedirect: '/'
      })
    )
	)
	app.use(route.get('/logout', logout))
	app.use(route.get('/', index))

	app.use(route.get('/api/csrf', getCsrf))
	app.use(requireTeamA)
	// sample protected endpoint which requires to be logged in.
	app.use(route.post('/api/protected', protectedEndpoint))
}
