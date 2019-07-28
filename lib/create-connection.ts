import config from './config'
import path from 'path'
import {Connection, createConnection, ConnectionOptions} from 'typeorm'

const options: ConnectionOptions = {
	...config.database,
	type: 'postgres',
	entities: [
		path.join(__dirname, '/entities/*.ts')
	]
}

export default async () => {
	return createConnection(options)
}
