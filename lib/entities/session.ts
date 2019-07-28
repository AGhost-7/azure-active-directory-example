import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
class Session {
  @PrimaryColumn()
  key: string
  @Column('json')
  session: object
  @Column()
  expiresAt: Date
  @Column()
  createdAt: Date

  constructor(key: string, session: object, maxAge: number) {
    this.key = key
    this.createdAt = new Date()
    this.expiresAt = new Date(this.createdAt.getTime() + maxAge)
    this.session = session
  }

  set maxAge(value: number) {
    this.expiresAt = new Date(Date.now() + value)
  }
}

export default Session
