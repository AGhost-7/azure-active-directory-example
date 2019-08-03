import koaBody from 'koa-body'
import session from 'koa-session'
import render from 'koa-ejs'
import config from './config'
import route from 'koa-route'
import passport from './passport'
import Koa from 'koa'
import path from 'path'
import routes from './routes'
import sessionStore from './session-store'
import csrf from './csrf'

const app = new Koa()

app.use(koaBody())

render(app, {
  root: path.join(__dirname, 'views'),
  layout: false
})

app.keys = [config.secret]

app.use(session({
	store: sessionStore,
	// no need to sign since the session is stored in the database
	signed: false
}, app))
app.use(passport.initialize())
app.use(passport.session())
app.use(csrf)
routes(app)

export default app
