import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_password_resets' })
export class UserForgotResetEntity {
	@PrimaryGeneratedColumn({type: 'bigint'})
	id: number;

	@Column()
	email: string;

	@Column({nullable: true})
	token?: string | null;

	@CreateDateColumn({type: "timestamp", nullable: true})
	create_at: string;

	@UpdateDateColumn({type: "timestamp", nullable: true})
	updated_at: string;
}