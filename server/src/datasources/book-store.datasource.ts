import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  connector: 'postgresql',
  url: '',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '1234',
  database: 'postgres'
};


@lifeCycleObserver('datasource')
export class BookStoreDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'bookStore';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.bookStore', { optional: true })
    dsConfig: any = config,
  ) {

    if (process.env.DB_HOST) {
      dsConfig.host = process.env.DB_HOST;
    }

    if (process.env.DB_PORT) {
      dsConfig.port = parseInt(process.env.DB_PORT);
    }

    if (process.env.DB_USER_NAME) {
      dsConfig.user = process.env.DB_USER_NAME;
    }

    if (process.env.DB_PASSWORD) {
      dsConfig.password = process.env.DB_PASSWORD;
    }

    if (process.env.DB_DATABASE_NAME) {
      dsConfig.database = process.env.DB_DATABASE_NAME;
    }

    console.log('====================================');
    console.log(dsConfig);
    console.log('====================================');
    super(dsConfig);
  }
}
