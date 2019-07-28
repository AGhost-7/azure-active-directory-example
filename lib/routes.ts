import config from './config'
import { URLSearchParams } from 'url'
import passport from './passport'
import route from 'koa-route'
import Koa from 'koa'

async function index(ctx: Koa.Context, next: Function) {
	//console.log('user:', ctx.state.user)
	await ctx.render('index', { user: ctx.state.user })
}

async function logout(ctx: Koa.Context) {
	await ctx.logout()
	await ctx.redirect('/')
}

async function redirectHome(ctx: Koa.Context) {
	return ctx.redirect('/')
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
}
