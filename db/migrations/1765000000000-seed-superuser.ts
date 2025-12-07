import { MigrationInterface, QueryRunner } from 'typeorm';
import { hash } from 'bcrypt';

export class SeedSuperuser1765000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const name = 'superuser';
    const email = process.env.SUPERUSER_EMAIL || 'admin@example.com';
    const password = 'Super@1234';

    const hashed = await hash(password, 10);

    // Insert user with admin role. role column is an enum[] type; use Postgres array literal.
    await queryRunner.query(
      `INSERT INTO "users" (name, email, password, role, "createdAt") VALUES ($1, $2, $3, $4, now())`,
      [name, email, hashed, '{admin}'],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const email = process.env.SUPERUSER_EMAIL || 'admin@example.com';
    await queryRunner.query(`DELETE FROM "users" WHERE email = $1`, [email]);
  }
}
