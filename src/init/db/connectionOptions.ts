import { ConnectionOptions } from 'typeorm';
import { join } from 'path';

import { db } from '../../config';

const getConnectionOptions = () => {
  const connectionOptions: ConnectionOptions = {
    type: 'postgres',
    logging: false,
    entities: [join(__dirname, '../../db/entities/**/*{.ts,.js}')],
    migrations: [join(__dirname, '../../db/migrations/**/*{.ts,.js}')],
    subscribers: [join(__dirname, '../../db/subscribers/**/*{.ts,.js}')],
    cli: {
      entitiesDir: join(__dirname, '../../db/entities'),
      migrationsDir: join(__dirname, '../../db/migrations'),
      subscribersDir: join(__dirname, '../../db/subscribers'),
    },
  };
  // Heroku
  if (process.env.DATABASE_URL) {
    return {
      url: process.env.DATABASE_URL,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      ...connectionOptions,
    };
  }
  // Local
  return {
    host: db.host,
    port: db.port,
    username: db.user,
    password: db.password,
    database: db.name,
    ...connectionOptions,
  };
};

export default getConnectionOptions();
