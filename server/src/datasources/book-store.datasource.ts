import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  name: 'bookStore',
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
    dsConfig: object = config,
  ) {


    super(dsConfig);
  }
}
