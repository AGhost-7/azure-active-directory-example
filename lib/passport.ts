import fetch from 'node-fetch'
import { OIDCStrategy } from 'passport-azure-ad'
import config from './config'
import { callbackify } from 'util'
import passport from 'koa-passport'
import { getManager } from 'typeorm'
import createDebug from 'debug'
import User from './entities/user'

const debug = createDebug('example:passport')

interface Profile {
	oid: string
	sub: string
	displayName: string
	name: {
		familyName: string
		givenName: string
		middleName: string
	}
	_raw: string
	_json: any
}

async function serializeUser(user: User) {
	return user.id
}

async function deserializeUser(id: number) {
	return getManager().findOne(User, id)
}

async function authorized(
	iss: any,
	sub: any,
	profile: Profile,
	accessToken: string,
	refreshToken: string
) {
	let user = await getManager().findOne(User, {
		activeDirectoryId: profile.sub
	})

	if (!user) {
		user = new User(profile.displayName)
		user.activeDirectoryId = profile.sub
		user.activeDirectoryApiId = profile.oid
		user.activeDirectoryToken = accessToken
		user.activeDirectoryRefreshToken = refreshToken
		await getManager().insert(User, user)
	} else {
		user.activeDirectoryToken = accessToken
		user.activeDirectoryRefreshToken = refreshToken
		await getManager().save(User, user)
	}

  return user
}

passport.serializeUser(callbackify(serializeUser))
passport.deserializeUser(callbackify(deserializeUser))
// hack since the type definition is wrong
const Strategy: any = OIDCStrategy
passport.use(new Strategy(config.activeDirectory, function(
	iss: any,
	sub: any,
	profile: Profile,
	accessToken: string,
	refreshToken: string,
	done: Function) {

	authorized(iss, sub, profile, accessToken, refreshToken)
		.then(res => done(null, res))
		.catch(err => done(err))
}))

export default passport
