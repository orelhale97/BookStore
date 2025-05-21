import { inject } from '@loopback/core';
import { DataObject, DefaultCrudRepository, Filter } from '@loopback/repository';
import { BookStoreDataSource } from '../datasources';
import { Publisher, PublisherRelations } from '../models';

export class PublisherRepository extends DefaultCrudRepository<
  Publisher,
  typeof Publisher.prototype.id,
  PublisherRelations
> {
  constructor(
    @inject('datasources.bookStore') dataSource: BookStoreDataSource,
  ) {
    super(Publisher, dataSource);
  }

  async findOrCreate(filter: Filter<Publisher>, data: DataObject<Publisher>): Promise<Publisher> {

    const existing = await this.findOne(filter);
    if (existing) return existing;
    return this.create(data);
  }
}
