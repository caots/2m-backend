import { COMMON_STATUS, STATUS_COMMON, STATUS_VERIFIED, UserRole } from 'src/commons/constants/config';
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserSessionEntity } from './userSession.entity';

@Entity({ name: 'user' })
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	full_name: string;

	@Column()
	age: number;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@Column({ default: STATUS_COMMON.ACTIVE })
	status: string;

	@Column({ default: STATUS_VERIFIED.INACTIVE })
	email_verified?: number | null;

	@Column({ nullable: true })
	verified_token?: string | null;

	@Column({ default: UserRole.USER })
	roles: string;

	@CreateDateColumn({ type: "timestamp", nullable: true })
	created_at: string;

	@UpdateDateColumn({ type: "timestamp", nullable: true })
	updated_at: string;

	@BeforeInsert()
	emailToLowerCase() {
		this.email = this.email.toLowerCase();
	}

	@Column({nullable: true})
	customer_ssl: string | null;

	// @BeforeInsert()
	// setCreationTime() {
	// 	this.create_at = new Date();
	// 	this.updated_at = new Date();
	// }

	@OneToMany(() => UserSessionEntity, (session) => session.user) // note: we will create author property in the Photo class below
	session: UserSessionEntity[]
}
