import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCreatedAtColumnType1761569487887
  implements MigrationInterface
{
  name = 'ChangeCreatedAtColumnType1761569487887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
  }
}
