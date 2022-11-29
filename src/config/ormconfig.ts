import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ENV_VALUE } from 'src/commons/constants/config';
// import entities = require('./entities');

const ormconfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: ENV_VALUE.DB_HOST_NAME,
    port: parseInt(ENV_VALUE.DB_PORT),
    username: ENV_VALUE.DB_ADMIN_USERNAME,
    password: ENV_VALUE.DB_ADMIN_PASSWORD,
    database: ENV_VALUE.DB_NAME,
    autoLoadEntities: true,
    synchronize: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/databases/migrations/**/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/databases/migrations',
      }
}

export default ormconfig;
