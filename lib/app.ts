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

const app = new Koa()

app.use(koaBody())

render(app, {
  root: path.join(__dirname, 'views'),
  layout: false
})

app.keys = [config.secret]

app.use(session({ store: sessionStore }, app))
app.use(passport.initialize())
app.use(passport.session())
routes(app)

export default app
