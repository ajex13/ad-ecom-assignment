import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedItems1764099181437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (let i = 1; i <= 30; i++) {
      await queryRunner.query(
        `INSERT INTO "items" (name, price) VALUES ($1, $2)`,
        [`Item ${i}`, i * 10],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove all rows from the items table
    await queryRunner.query(`DELETE FROM "items"`);
  }
}
