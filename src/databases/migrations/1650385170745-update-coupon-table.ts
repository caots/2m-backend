import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class updateCouponTable1650385170745 implements MigrationInterface {
  down(queryRunner: QueryRunner): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE coupon ALTER COLUMN expired_from SET NOT NULL;
        ALTER TABLE coupon ALTER COLUMN expired_to SET NOT NULL;
        ALTER TABLE coupon ALTER COLUMN nbr_used SET NOT NULL;
        ALTER TABLE coupon ALTER COLUMN is_nbr_user_limit SET NOT NULL;
      `,
    )
  }
}
