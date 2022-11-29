import { STATUS_COMMON } from 'src/commons/constants/config';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'coupon' })
export class CouponEntity {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id: number;

	@Column()
	code: string;

	@Column()
	discount_type: number;

	@Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
	discount_value: number;

	@Column()
	max_discount_value: number;

	@Column({ default: null, nullable: true })
	expired_from!: Date | null;

	@Column({ default: null, nullable: true })
	expired_to!: Date | null;

	@Column({ default: null, nullable: true })
	nbr_used!: number | null;

	@Column({ default: null, nullable: true })
	is_nbr_user_limit!: number | null;

	@Column({ default: STATUS_COMMON.ACTIVE })
	status: string;

	@CreateDateColumn({ type: "timestamp", nullable: true })
	created_at: string;

	@UpdateDateColumn({ type: "timestamp", nullable: true })
	updated_at: string;
}
