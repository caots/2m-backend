import { STATUS_COMMON } from 'src/commons/constants/config';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'product' })
export class ProductEntity {
	@PrimaryGeneratedColumn({type: 'bigint'})
	id: number;

	@Column()
	name: string;

	@Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
	price: number;

	@Column({default: STATUS_COMMON.ACTIVE})
	status: string;

	@Column({nullable: true})
	description?: string | null;

	@Column()
	make: string;

	@Column()
	model: string;

	@Column({nullable: true})
	product_image?: string | null;

	@Column()
	size: string;

	@Column()
	year: number;

	@CreateDateColumn({type: "timestamp", nullable: true})
	created_at: string;

	@UpdateDateColumn({type: "timestamp", nullable: true})
	updated_at: string;
}

export interface ICreateProduct{
	name: string;
	price: number;
	make: string;
	description: string;
	model: string;
	product_image: string;
	size?: string;
	year?: number;
}