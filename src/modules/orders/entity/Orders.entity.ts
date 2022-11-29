import { STATUS_COMMON, STATUS_PAYMENT } from 'src/commons/constants/config';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'orders' })
export class OrdersEntity {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id: number;

	@Column({ type: 'bigint' })
	user_id: number;

	@Column({nullable: true})
	coupon_code?: string | null;

	@Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  total_price: number;

	@Column({ type: "decimal", precision: 10, scale: 2, default: 0, nullable: true })
  shipping_price?: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0, nullable: true })
  tax?: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0, nullable: true })
  discount_value?: number;

  @Column()
	ssl_card_type: string;

  @Column()
	ssl_cvc: string;

  @Column()
	ssl_exp_date: string;

  @Column()
	ssl_card_name: string;

  @Column()
	ssl_card_number: string;

  @Column({nullable: true})
	description?: string | null;

	@Column({nullable: true})
	error_message?: string | null;

  @Column()
	address: string;

  @Column()
	city_name: string;

  @Column()
	state_name: string;

  @Column()
	postcode: string;

  @Column()
	country: string;

  @Column({default: STATUS_PAYMENT.IN_PROGRESS_CHECKOUT})
	status: string;

  @CreateDateColumn({ type: "timestamp", nullable: true })
	created_at: string;

	@UpdateDateColumn({ type: "timestamp", nullable: true })
	updated_at: string;
}

export interface ICreateOrder{
	total_price: number;
	ssl_card_type: string;
	ssl_cvc: string;
	ssl_exp_date: string;
	ssl_card_number: string;
	ssl_card_name: string;
	address: string;
	city_name: string;
	state_name: string;
	postcode: string;
	country: string;
	status: string;
	error_message?: string;
	user_id: number;
}