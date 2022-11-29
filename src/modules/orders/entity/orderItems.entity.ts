import { STATUS_COMMON } from 'src/commons/constants/config';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'order_items' })
export class OrderItemsEntity {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id: number;

	@Column({ type: 'bigint' })
	order_id: number;

  @Column({ type: 'bigint' })
	product_id: number;

	@Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column()
  quantity: number;

	@Column({nullable: true})
	options?: string | null;

  @Column({default: STATUS_COMMON.ACTIVE})
	license_status: string;

	@Column({nullable: null})
	license_key: string | null;

  @CreateDateColumn({ type: "timestamp", nullable: true })
	created_at: string;

	@UpdateDateColumn({ type: "timestamp", nullable: true })
	updated_at: string;
}

export interface ICreateOrderItem{
	price: number;
	quantity: number;
	license_status: string;
	order_id: number;
	product_id: number;
	license_key: string;
	options?: string;
}