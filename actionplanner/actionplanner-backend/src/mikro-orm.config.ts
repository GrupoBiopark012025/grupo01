import { Options } from '@mikro-orm/core';
import * as path from 'path';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const mikroOrmConfig: Options = {
  port: 5432,
  user: 'postgres',
  host: 'localhost',
  driver: PostgreSqlDriver,
  dbName: 'action-planner',
  password: 'docker',
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  migrations: {
    path: path.resolve(__dirname, './src/migrations')
  },
};

export default mikroOrmConfig;
