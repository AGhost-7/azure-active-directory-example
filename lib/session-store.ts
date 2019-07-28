import Session from './entities/session'
import { getManager } from 'typeorm'

export default {
	async get(key: string, maxAge: number, options: { rolling: boolean }) {
		const manager = getManager()
		const dbSession = await manager.findOne(Session, { key })
		if (!dbSession) return
		if (dbSession.expiresAt.getTime() < Date.now()) {
			await manager.delete(Session, dbSession)
			return
		}
		return dbSession.session
	},

	async set(
		key: string,
		session: object,
		maxAge: number,
		options: { changed: boolean, rolling: boolean }) {

		const manager = getManager()

		let dbSession = await manager.findOne(Session, { key })

		if (!dbSession) {
			const dbSession = new Session(key, session, maxAge)
			await manager.insert(Session, dbSession)
		} else if (options.changed) {
			dbSession.maxAge = maxAge
			dbSession.session = session
			await manager.save(Session, dbSession)
		}
	},

	async destroy(key: string) {
		return getManager().delete(Session, { key })
	}
}
