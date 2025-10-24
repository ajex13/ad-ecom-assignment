import { env } from './env';
import { DataSourceOptions, DataSource } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: env.pgdb.host,
  port: env.pgdb.port,
  username: env.pgdb.username,
  password: env.pgdb.password,
  database: env.pgdb.name,
  entities: [],
  migrations: [],
  synchronize: false,
  logging: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
