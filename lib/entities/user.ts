import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id?: number
  @Column()
  name: string
  @Column()
	activeDirectoryId?: string
	@Column()
	activeDirectoryApiId?: string
  @Column()
  activeDirectoryToken?: string
  @Column()
  activeDirectoryRefreshToken?: string

  constructor(name: string) {
    this.name = name
  }
  toJSON(): any {
    return {
      name: this.name,
      id: this.id
    }
  }
}

export default User
