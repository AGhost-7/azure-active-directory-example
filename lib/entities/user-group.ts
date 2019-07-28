import User from './user'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
class UserGroup {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  name: string

  @ManyToOne(type => User)
  user: User

  constructor(name: string, user: User) {
    this.name = name
    this.user = user
  }
}

export default UserGroup
