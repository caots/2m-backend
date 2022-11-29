import { LICENSE_STATUS } from 'src/commons/constants/config';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn, PrimaryColumn, BeforeUpdate } from 'typeorm';

@Entity({ name: 'vehicle' })
export class VehicleEntity {
	@PrimaryGeneratedColumn({type: 'bigint'})
	id: number;

	@Column({type: 'bigint'})
	user_id: number;

	@Column({nullable: true})
	vin_number?: string | null;

	@Column({nullable: true})
	model?: string | null;

	@Column({nullable: true})
	firmware?: string | null;

	@Column({nullable: true})
	hardware?: string | null;

	@Column({nullable: true})
	make_car?: string | null;

	@Column({nullable: true})
	engine_code?: string | null;

	@Column({nullable: true})
	license_key?: string | null;

  @Column({ default: LICENSE_STATUS.UNASSIGNED })
	license_status: string;

	@CreateDateColumn({type: "timestamp", nullable: true})
	created_at: string;

	@UpdateDateColumn({type: "timestamp", nullable: true})
	updated_at: string;
	
}
