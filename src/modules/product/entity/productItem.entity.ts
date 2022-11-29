import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'product-items' })
export class ProductItemsEntity {
	@PrimaryGeneratedColumn({type: 'bigint'})
	id: number;

	@Column()
	name: string;

  @Column({type: 'bigint'})
	product_id: number;

	@Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
	price: number;

	@CreateDateColumn({type: "timestamp", nullable: true})
	created_at: string;

	@UpdateDateColumn({type: "timestamp", nullable: true})
	updated_at: string;
}

export interface ICreateProductItem{
	name: string;
	product_id: number;
	price: number;
}