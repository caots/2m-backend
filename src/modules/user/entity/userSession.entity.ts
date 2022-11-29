import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, JoinColumn, OneToOne, ManyToOne, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user-session' })
export class UserSessionEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;

	@Column()
	access_token: string;

	@Column()
	refresh_token: string;

	@Column({type: 'bigint', nullable: true})
	expires_in?: number | null;

	@CreateDateColumn({ type: "timestamp", nullable: true })
	created_at: string;

	@UpdateDateColumn({ type: "timestamp", nullable: true })
	updated_at: string;

	@Column({ nullable: true , type: 'bigint'})
	expires_date: number;
	
	@ManyToOne(() => UserEntity, (user) => user.session)
    user: UserEntity
}
